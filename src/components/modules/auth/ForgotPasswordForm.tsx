"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotPasswordAction } from "@/actions/authActions/_forgotPasswordAction";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import AppField from "@/components/shared/form/ReUsableField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { forgotPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: forgotPasswordAction,
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = await mutateAsync(value);

        if (!result.success) {
          setServerError(result.message || "Failed to send reset code");
          return;
        }

        router.push(
          `/reset-password?email=${encodeURIComponent(value.email)}&sent=true`
        );
      } catch (error: any) {
        setServerError(error.message || "Failed to send reset code");
      }
    },
  });

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      {/* Absolute Back Route Navigation */}
      <nav className="absolute top-4 left-4 z-20">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="group gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Login
          </Button>
        </Link>
      </nav>

      {/* Strictly Clean & Centered Container */}
      <div className="w-full max-w-[360px] space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send a 6-digit reset code
          </p>
        </div>

        {/* Minimalized Server Restriction Alert Banner */}
        <div className="rounded-md border border-border bg-muted/40 p-3 text-left">
          <p className="text-xs font-medium text-foreground mb-0.5">
            Verified Account Required
          </p>
          <p className="text-[11px] leading-normal text-muted-foreground">
            If the account exists and is verified, you will receive an OTP. Unverified credentials must be activated first.
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
            validators={{ onChange: forgotPasswordZodSchema.shape.email }}
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

          {serverError && (
            <Alert variant="destructive" className="rounded-md py-2.5">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit] as const}>
            {([canSubmit]) => (
              <div className="pt-1">
                <AppSubmitButton
                  isPending={isPending}
                  pendingLabel="Sending Reset Code..."
                  disabled={!canSubmit}
                  className="w-full rounded-md"
                >
                  Send Reset Code
                </AppSubmitButton>
              </div>
            )}
          </form.Subscribe>
        </form>

        {/* Minimal Bottom Alternative Trigger Split */}
        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Remembered your credentials?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordForm;