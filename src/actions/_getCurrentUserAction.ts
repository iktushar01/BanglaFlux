"use server";

import { cookies } from "next/headers";
import { ApiResponse } from "@/types/api.types";
import { getUserInfo } from "@/services/auth/auth.services";

/**
 * Interface representing the specific structure of your User data
 * Based on your provided JSON result
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: "CLIENT" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";
  image: string | null;
  createdAt: string;
  updatedAt?: string;
  needPasswordChange?: boolean;
  client?: {
    id: string;
    profilePhoto: string;
    contactNumber: string | null;
    address: string | null;
    gender: string | null;
  };
  admin?: {
    id: string;
    profilePhoto: string | null;
    contactNumber: string | null;
  };
}

type CurrentUserActionResult =
  | ApiResponse<UserProfile>
  | { success: false; data: null; message: string };

/**
 * Fetches the current user profile from the backend.
 * Uses the httpOnly cookies automatically via httpClient.
 */
export const getCurrentUserAction = async (): Promise<CurrentUserActionResult> => {
  try {
    const backendUser = await getUserInfo();

    if (backendUser) {
      return {
        success: true,
        data: backendUser as UserProfile,
        message: "Profile loaded from backend",
      };
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
      throw new Error("No active authenticated user could be resolved.");
    }

    const user = JSON.parse(userCookie);

    return {
      success: true,
      data: user,
      message: "Profile loaded from cookies",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load profile. Please log in again.";

    console.error("FETCH_USER_ERROR:", message);

    return {
      success: false,
      data: null,
      message,
    };
  }
};
