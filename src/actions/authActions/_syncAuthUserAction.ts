"use server";

import { setCookie } from "@/lib/cookieUtils";
import { getUserInfo } from "@/services/auth/auth.services";
import { UserFromCookie } from "@/types/auth.types";

const mapUserToCookieShape = (user: {
  id?: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  emailVerified?: boolean;
  needPasswordChange?: boolean;
  createdAt?: string;
  image?: string | null;
  client?: { profilePhoto?: string | null } | null;
  admin?: { profilePhoto?: string | null } | null;
}): UserFromCookie => {
  const avatar =
    user.image ??
    user.client?.profilePhoto ??
    user.admin?.profilePhoto ??
    null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    needPasswordChange: user.needPasswordChange,
    createdAt: user.createdAt,
    avatar,
    image: user.image ?? avatar,
  };
};

export const syncAuthUserAction = async (): Promise<{
  success: boolean;
  data: UserFromCookie | null;
  message?: string;
}> => {
  try {
    const backendUser = await getUserInfo();

    if (!backendUser) {
      return {
        success: false,
        data: null,
        message: "No authenticated user found",
      };
    }

    const cookieUser = mapUserToCookieShape(backendUser);

    await setCookie("user", JSON.stringify(cookieUser), 7 * 24 * 60 * 60, false);

    return {
      success: true,
      data: cookieUser,
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Failed to sync user",
    };
  }
};
