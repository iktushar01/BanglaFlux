"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotPasswordAction } from "@/actions/authActions/_forgotPasswordAction";
import { resetPasswordAction } from "@/actions/authActions/_resetPasswordAction";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import AppField from "@/components/shared/form/ReUsableField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { resetPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, Eye, EyeOff, Lock, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const sentFromQuery = searchParams.get("sent") === "true";

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    sentFromQuery
      ? "A reset code was sent if the account exists."
      : null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: resetPasswordAction,
  });

  const { mutateAsync: resendCode, isPending: isResending } = useMutation({
    mutationFn: forgotPasswordAction,
  });

  const form = useForm({
    defaultValues: {
      email: emailFromQuery,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);

      try {
        const result = await mutateAsync(value);

        if (!result.success) {
          setServerError(result.message || "Failed to reset password");
          return;
        }

        router.push(
          `/login?reset=success&email=${encodeURIComponent(value.email)}`
        );
      } catch (error: any) {
        setServerError(error.message || "Failed to reset password");
      }
    },
  });

  const handleResendCode = async () => {
    const enteredEmail = form.getFieldValue("email");
    const validation = resetPasswordZodSchema.shape.email.safeParse(enteredEmail);

    setServerError(null);

    if (!validation.success) {
      setServerError(validation.error.issues[0]?.message || "Invalid email");
      return;
    }

    const result = await resendCode({ email: validation.data });

    if (!result.success) {
      setServerError(result.message || "Failed to resend reset code");
      return;
    }

    setSuccessMessage(
      "A new reset code was requested. Check your inbox."
    );
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      {/* Absolute Back Route Navigation */}
      <nav className="absolute top-4 left-4 z-20">
        <Link href={emailFromQuery ? `/forgot-password` : "/login"}>
          <Button variant="ghost" size="sm" className="group gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </Button>
        </Link>
      </nav>

      {/* Strictly Clean & Centered Container */}
      <div className="w-full max-w-[360px] space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email, temporary token, and new credentials
          </p>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: resetPasswordZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="name@example.com"
                prepend={<Mail className="h-4 w-4 text-muted-foreground/70" />}
              />
            )}
          </form.Field>

          <form.Field
            name="otp"
            validators={{ onChange: resetPasswordZodSchema.shape.otp }}
          >
            {(field) => (
              <div className="flex flex-col items-center justify-center gap-2 py-1">
                <Label className="text-xs text-muted-foreground self-start">
                  Reset Verification Code
                </Label>

                <InputOTP
                  maxLength={6}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-10 w-10 text-base"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-xs font-medium text-destructive self-start">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="newPassword"
            validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                prepend={<Lock className="h-4 w-4 text-muted-foreground/70" />}
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                }
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{ onChange: resetPasswordZodSchema.shape.confirmPassword }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                prepend={<Lock className="h-4 w-4 text-muted-foreground/70" />}
                append={
                  <Button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                }
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive" className="rounded-md py-2.5">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="rounded-md py-2.5 border-border bg-muted/50 text-foreground">
              <AlertDescription className="text-xs">{successMessage}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit] as const}>
            {([canSubmit]) => (
              <div className="pt-2">
                <AppSubmitButton
                  isPending={isPending}
                  pendingLabel="Resetting Password..."
                  disabled={!canSubmit}
                  className="w-full rounded-md"
                >
                  Update Password
                </AppSubmitButton>
              </div>
            )}
          </form.Subscribe>
        </form>

        {/* Minimal Bottom Action Split */}
        <div className="space-y-3 text-center pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the OTP token yet?
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs h-9"
            onClick={handleResendCode}
            disabled={isResending}
          >
            <RefreshCw className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`} />
            {isResending ? "Resending..." : "Resend code"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordForm;