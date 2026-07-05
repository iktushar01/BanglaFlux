import type { JwtPayload } from "jsonwebtoken";
import type { UserRole } from "./authUtils";

const base64UrlToUint8Array = (base64Url: string): Uint8Array => {
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
};

export const decodeJwtPayload = (token: string): JwtPayload | null => {
    try {
        const parts = token.split(".");

        if (parts.length !== 3) {
            return null;
        }

        const payload = JSON.parse(
            new TextDecoder().decode(base64UrlToUint8Array(parts[1])),
        ) as JwtPayload;

        return payload;
    } catch {
        return null;
    }
};

export const verifyAccessToken = async (
    token: string,
    secret: string,
): Promise<{ success: boolean; data: JwtPayload | null }> => {
    const parts = token.split(".");

    if (parts.length !== 3) {
        return { success: false, data: null };
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;

    try {
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"],
        );

        const signature = base64UrlToUint8Array(signatureB64);
        const valid = await crypto.subtle.verify(
            "HMAC",
            key,
            signature as BufferSource,
            new TextEncoder().encode(signingInput),
        );

        if (!valid) {
            return { success: false, data: null };
        }

        const payload = decodeJwtPayload(token);

        if (!payload?.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
            return { success: false, data: null };
        }

        return { success: true, data: payload };
    } catch {
        return { success: false, data: null };
    }
};

export const isTokenExpiringSoon = (
    token: string,
    thresholdInSeconds = 300,
): boolean => {
    const payload = decodeJwtPayload(token);

    if (!payload?.exp) {
        return false;
    }

    const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000);
    return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
};

export const normalizeUserRole = (
    role: string | undefined | null,
): UserRole | null => {
    if (!role) {
        return null;
    }

    const normalizedRole = role.toUpperCase();

    if (normalizedRole === "SUPER_ADMIN" || normalizedRole === "ADMIN") {
        return "ADMIN";
    }

    if (normalizedRole === "CLIENT") {
        return "CLIENT";
    }

    return null;
};

export const getAccessTokenSecret = (): string | undefined =>
    process.env.ACCESS_TOKEN_SECRET ?? process.env.JWT_ACCESS_SECRET;
