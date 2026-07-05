"use server";

import { httpClient } from "@/lib/axios/httpClient";

interface VerifyPayload {
  email: string;
  otp: string;
}

export const verifyEmailAction = async (payload: VerifyPayload) => {
  try {
    // result is already response.data because of your httpClient implementation
    const result = await httpClient.post<any>("/auth/verify-email", payload);

    // If your backend returns { success: true, ... }, this goes straight to the component
    return result; 
    
  } catch (error: any) {
    // Extract the actual error message from the backend response
    const errorMessage = error.response?.data?.message || "Invalid or expired code";
    
    console.error("VERIFICATION_API_ERROR:", errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  } 
};