"use server";

import { cookies } from "next/headers";

/**
 * Sets a secure cookie in the browser
 */
export const setCookie = async (
    name : string,
    value : string,
    maxAgeInSeconds : number,
    httpOnly : boolean = true
) => {
    const cookieStore = await cookies();

    cookieStore.set(name, value, {
        httpOnly : httpOnly,
        secure : process.env.NODE_ENV === "production", // Better for local dev
        sameSite : "lax",
        path : "/",
        maxAge : maxAgeInSeconds,
    });
};

/**
 * Retrieves a cookie value by name
 */
export const getCookie = async (name : string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
};

/**
 * Deletes a cookie by name
 */
export const deleteCookie = async (name : string) => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
};