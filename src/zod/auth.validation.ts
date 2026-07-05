import { z } from "zod";

export const loginZodSchema = z.object({
    email : z.email("Invalid email address"),
    password : z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long")
        // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        // .regex(/[0-9]/, "Password must contain at least one number")
        // .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
})

export type ILoginPayload = z.infer<typeof loginZodSchema>;


export const registerZodSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long"),
    image: z.string().optional(),
});

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export const forgotPasswordZodSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;

export const resetPasswordZodSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        otp: z
            .string()
            .length(6, "OTP must be 6 digits")
            .regex(/^\d{6}$/, "OTP must contain only digits"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long"),
        confirmPassword: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;
