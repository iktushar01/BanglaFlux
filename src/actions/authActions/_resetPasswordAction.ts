"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  IResetPasswordPayload,
  resetPasswordZodSchema,
} from "@/zod/auth.validation";
import { AxiosError } from "axios";

export const resetPasswordAction = async (
  payload: IResetPasswordPayload
): Promise<ApiResponse<null> | ApiErrorResponse> => {
  const parsedPayload = resetPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const { email, otp, newPassword } = parsedPayload.data;

    return await httpClient.post<null>("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to reset password",
    };
  }
};
