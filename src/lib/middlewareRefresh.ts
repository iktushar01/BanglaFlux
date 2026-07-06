import { NextRequest, NextResponse } from "next/server";
import { decodeJwtPayload } from "./middlewareAuth";

type RefreshedTokens = {
    accessToken: string;
    refreshToken: string;
    sessionToken?: string;
};

type BackendSessionUser = {
    role?: string;
};

const buildAuthCookieHeader = (request: NextRequest, accessToken?: string) => {
    const token = accessToken ?? request.cookies.get("accessToken")?.value;
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const cookieParts = [
        token ? `accessToken=${token}` : null,
        refreshToken ? `refreshToken=${refreshToken}` : null,
        sessionToken ? `better-auth.session_token=${sessionToken}` : null,
    ].filter(Boolean);

    return cookieParts.join("; ");
};

const getTokenMaxAge = (token: string, fallbackMaxAgeInSeconds: number): number => {
    const payload = decodeJwtPayload(token);
    const remainingSeconds = payload?.exp
        ? payload.exp - Math.floor(Date.now() / 1000)
        : 0;

    return remainingSeconds > 0 ? remainingSeconds : fallbackMaxAgeInSeconds;
};

const AUTH_COOKIE_NAMES = [
    "accessToken",
    "refreshToken",
    "better-auth.session_token",
    "user",
] as const;

export const clearAuthCookiesOnResponse = (response: NextResponse): void => {
    for (const name of AUTH_COOKIE_NAMES) {
        response.cookies.delete(name);
    }
};

export const applyAuthCookies = (
    response: NextResponse,
    tokens: RefreshedTokens,
): void => {
    response.cookies.set("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: getTokenMaxAge(tokens.accessToken, 60 * 60 * 24),
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: getTokenMaxAge(tokens.refreshToken, 7 * 24 * 60 * 60),
    });

    if (tokens.sessionToken) {
        response.cookies.set("better-auth.session_token", tokens.sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60,
        });
    }
};

export type RefreshTokensResult =
    | { status: "refreshed"; tokens: RefreshedTokens }
    | { status: "unauthorized" }
    | { status: "failed" };

export const refreshTokensFromRequest = async (
    request: NextRequest,
): Promise<RefreshTokensResult> => {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!refreshToken || !baseApiUrl) {
        return { status: "failed" };
    }

    try {
        const response = await fetch(`${baseApiUrl}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: buildAuthCookieHeader(request),
            },
            cache: "no-store",
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { status: "unauthorized" };
            }
            return { status: "failed" };
        }

        const body = await response.json();
        const { accessToken, refreshToken: newRefreshToken, token } = body.data ?? {};

        if (!accessToken || !newRefreshToken) {
            return { status: "failed" };
        }

        return {
            status: "refreshed",
            tokens: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken: token,
            },
        };
    } catch (error) {
        console.error("Error refreshing token in middleware:", error);
        return { status: "failed" };
    }
};

export const validateSessionFromBackend = async (
    request: NextRequest,
    accessToken?: string,
): Promise<{ valid: boolean; user: BackendSessionUser | null; unauthorized: boolean }> => {
    const token = accessToken ?? request.cookies.get("accessToken")?.value;
    const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!token || !baseApiUrl) {
        return { valid: false, user: null, unauthorized: false };
    }

    try {
        const response = await fetch(`${baseApiUrl}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: buildAuthCookieHeader(request, token),
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return {
                valid: false,
                user: null,
                unauthorized: response.status === 401,
            };
        }

        const body = await response.json();

        return {
            valid: true,
            user: (body.data ?? null) as BackendSessionUser | null,
            unauthorized: false,
        };
    } catch (error) {
        console.error("Error validating session in middleware:", error);
        return { valid: false, user: null, unauthorized: false };
    }
};
