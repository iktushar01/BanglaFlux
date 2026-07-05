import { NextRequest, NextResponse } from "next/server";
import {
    getDefaultDashboardRoute,
    getRouteOwner,
    isAuthRoute,
    UserRole,
} from "./lib/authUtils";
import {
    decodeJwtPayload,
    getAccessTokenSecret,
    isTokenExpiringSoon,
    normalizeUserRole,
    verifyAccessToken,
} from "./lib/middlewareAuth";
import {
    applyAuthCookies,
    refreshTokensFromRequest,
    validateSessionFromBackend,
} from "./lib/middlewareRefresh";
import { UserFromCookie } from "./types/auth.types";

const readUserFromCookie = (request: NextRequest): UserFromCookie | null => {
    const rawUserCookie = request.cookies.get("user")?.value;

    if (!rawUserCookie) {
        return null;
    }

    try {
        return JSON.parse(rawUserCookie) as UserFromCookie;
    } catch (error) {
        console.error("Failed to parse user cookie in proxy:", error);
        return null;
    }
};

const redirectToLogin = (request: NextRequest, pathWithQuery: string) => {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathWithQuery);
    return NextResponse.redirect(loginUrl);
};

const redirectToRoleDashboard = (
    request: NextRequest,
    role: UserRole | null,
    pathWithQuery: string,
) => {
    if (!role) {
        return redirectToLogin(request, pathWithQuery);
    }

    return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(role), request.url),
    );
};

const resolveAuthState = async (
    request: NextRequest,
    accessToken: string | undefined,
    refreshToken: string | undefined,
    cookieUser: UserFromCookie | null,
) => {
    const accessTokenSecret = getAccessTokenSecret();
    let activeAccessToken = accessToken;
    let isValidAccessToken = false;
    let decodedAccessToken = null as Awaited<
        ReturnType<typeof verifyAccessToken>
    >["data"];
    let refreshResponse: NextResponse | null = null;

    const evaluateAccessToken = async (token: string | undefined) => {
        if (!token || !accessTokenSecret) {
            return { success: false, data: null };
        }

        return verifyAccessToken(token, accessTokenSecret);
    };

    let tokenResult = await evaluateAccessToken(activeAccessToken);
    isValidAccessToken = tokenResult.success;
    decodedAccessToken = tokenResult.data;

    const shouldAttemptRefresh =
        refreshToken &&
        (!activeAccessToken ||
            !isValidAccessToken ||
            (activeAccessToken && isTokenExpiringSoon(activeAccessToken)));

    if (shouldAttemptRefresh) {
        const refreshedTokens = await refreshTokensFromRequest(request);

        if (refreshedTokens) {
            activeAccessToken = refreshedTokens.accessToken;
            refreshResponse = NextResponse.next();
            applyAuthCookies(refreshResponse, refreshedTokens);

            tokenResult = await evaluateAccessToken(activeAccessToken);
            isValidAccessToken = tokenResult.success;
            decodedAccessToken = tokenResult.data;
        }
    }

    let backendSession: Awaited<ReturnType<typeof validateSessionFromBackend>> | null =
        null;

    if (!isValidAccessToken && activeAccessToken) {
        backendSession = await validateSessionFromBackend(
            request,
            activeAccessToken,
        );

        if (backendSession.valid) {
            isValidAccessToken = true;
            decodedAccessToken = decodeJwtPayload(activeAccessToken);
        }
    }

    let userRole = normalizeUserRole(decodedAccessToken?.role as string | undefined);

    if (!userRole && cookieUser?.role) {
        userRole = normalizeUserRole(cookieUser.role);
    }

    if (!userRole && backendSession?.valid) {
        userRole = normalizeUserRole(backendSession.user?.role);
    } else if (!userRole && activeAccessToken && isValidAccessToken) {
        backendSession ??= await validateSessionFromBackend(
            request,
            activeAccessToken,
        );
        userRole = normalizeUserRole(backendSession.user?.role);
    }

    return {
        activeAccessToken,
        isValidAccessToken,
        userRole,
        refreshResponse,
    };
};

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;
    const routeOwner = getRouteOwner(pathname);

    try {
        const accessToken = request.cookies.get("accessToken")?.value;
        const refreshToken = request.cookies.get("refreshToken")?.value;
        const cookieUser = readUserFromCookie(request);

        const { isValidAccessToken, userRole, refreshResponse } =
            await resolveAuthState(
                request,
                accessToken,
                refreshToken,
                cookieUser,
            );

        const createResponse = (response?: NextResponse | null) =>
            response ?? NextResponse.next();

        const isAuth = isAuthRoute(pathname);
        const isAuthenticated = Boolean(isValidAccessToken && userRole);

        // Rule 1: Logged-in users should not access auth pages,
        // except pages that may be mandatory due to account state.
        if (
            isAuth &&
            isAuthenticated &&
            pathname !== "/verify-email" &&
            pathname !== "/reset-password"
        ) {
            return redirectToRoleDashboard(
                request,
                userRole,
                pathWithQuery,
            );
        }

        // Rule 2: User is trying to access reset password page
        if (pathname === "/reset-password") {
            const email = request.nextUrl.searchParams.get("email");

            if (accessToken && email) {
                if (cookieUser?.needPasswordChange) {
                    return createResponse(refreshResponse);
                }

                return redirectToRoleDashboard(
                    request,
                    userRole,
                    pathWithQuery,
                );
            }

            if (email) {
                return createResponse(refreshResponse);
            }

            return redirectToLogin(request, pathWithQuery);
        }

        // Rule 3: Public route -> allow
        if (routeOwner === null) {
            return createResponse(refreshResponse);
        }

        // Rule 4: Protected route without valid auth -> redirect to login
        if (!isAuthenticated) {
            return redirectToLogin(request, pathWithQuery);
        }

        // Rule 5: Enforce verify-email / reset-password when account flags require it
        if (cookieUser) {
            if (cookieUser.emailVerified === false) {
                if (pathname !== "/verify-email") {
                    const verifyEmailUrl = new URL("/verify-email", request.url);
                    verifyEmailUrl.searchParams.set("email", cookieUser.email);
                    return NextResponse.redirect(verifyEmailUrl);
                }

                return createResponse(refreshResponse);
            }

            if (cookieUser.emailVerified && pathname === "/verify-email") {
                return redirectToRoleDashboard(
                    request,
                    userRole,
                    pathWithQuery,
                );
            }

            if (cookieUser.needPasswordChange) {
                if (pathname !== "/reset-password") {
                    const resetPasswordUrl = new URL("/reset-password", request.url);
                    resetPasswordUrl.searchParams.set("email", cookieUser.email);
                    return NextResponse.redirect(resetPasswordUrl);
                }

                return createResponse(refreshResponse);
            }

            if (
                cookieUser.needPasswordChange === false &&
                pathname === "/reset-password"
            ) {
                return redirectToRoleDashboard(
                    request,
                    userRole,
                    pathWithQuery,
                );
            }
        }

        // Rule 6: Common protected route -> allow any authenticated user
        if (routeOwner === "COMMON") {
            return createResponse(refreshResponse);
        }

        // Rule 7: Role-based protected route -> enforce role ownership
        if (routeOwner === "ADMIN" || routeOwner === "CLIENT") {
            if (routeOwner !== userRole) {
                return redirectToRoleDashboard(
                    request,
                    userRole,
                    pathWithQuery,
                );
            }
        }

        return createResponse(refreshResponse);
    } catch (error) {
        console.error("Error in proxy middleware:", error);

        if (routeOwner !== null) {
            return redirectToLogin(request, pathWithQuery);
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
    ],
};
