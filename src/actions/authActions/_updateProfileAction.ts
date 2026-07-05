"use server";

import { updateProfile } from "@/services/auth/auth.services";
import { syncAuthUserAction } from "@/actions/authActions/_syncAuthUserAction";

export const updateProfileAction = async (payload: FormData) => {
  try {
    const response = await updateProfile(payload);
    await syncAuthUserAction();

    return {
      success: true,
      data: response.data,
      message: response.message || "Profile updated successfully",
    };
  } catch (error: unknown) {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string; error?: string } };
      message?: string;
    };

    return {
      success: false,
      data: null,
      message:
        maybeAxiosError.response?.data?.message ||
        maybeAxiosError.response?.data?.error ||
        maybeAxiosError.message ||
        "Failed to update profile",
    };
  }
};
