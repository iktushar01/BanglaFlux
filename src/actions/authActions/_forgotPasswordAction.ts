"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  forgotPasswordZodSchema,
  IForgotPasswordPayload,
} from "@/zod/auth.validation";
import { AxiosError } from "axios";

export const forgotPasswordAction = async (
  payload: IForgotPasswordPayload
): Promise<ApiResponse<null> | ApiErrorResponse> => {
  const parsedPayload = forgotPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    return await httpClient.post<null>("/auth/forget-password", parsedPayload.data);
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to send reset code",
    };
  }
};
