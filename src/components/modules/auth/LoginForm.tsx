"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from "@/actions/authActions/_loginAction";
import AppField from "@/components/shared/form/ReUsableField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
  redirectPath?: string;
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value) as any;
        if (!result.success) {
          setServerError(result.message || "Login failed");
        }
      } catch (error: any) {
        setServerError(`Login failed: ${error.message}`);
      }
    }
  });

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      {/* Absolute Back Route Navigation */}
      <nav className="absolute top-4 left-4 z-20">
        <Link href="/">
          <Button variant="ghost" size="sm" className="group gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </Button>
        </Link>
      </nav>

      {/* Strictly Clean & Centered Container */}
      <div className="w-full max-w-[360px] space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
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
            validators={{ onChange: loginZodSchema.shape.email }}
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

          <div className="space-y-1">
            <form.Field
              name="password"
              validators={{ onChange: loginZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  prepend={<Lock className="h-4 w-4 text-muted-foreground/70" />}
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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
            
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          {serverError && (
            <Alert variant="destructive" className="rounded-md py-2.5">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit] as const}>
            {([canSubmit]) => (
              <div className="pt-2">
                <AppSubmitButton
                  isPending={isPending}
                  pendingLabel="Signing in..."
                  disabled={!canSubmit}
                  className="w-full rounded-md"
                >
                  Sign In
                </AppSubmitButton>
              </div>
            )}
          </form.Subscribe>
        </form>

        {/* Minimal Separator Split */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border" />
          <span className="flex-shrink mx-3 text-xs text-muted-foreground">
            or
          </span>
          <div className="flex-grow border-t border-border" />
        </div>

        {/* Native OAuth Button */}
        <Button
          variant="outline"
          className="w-full h-10 rounded-md font-medium gap-2 border-border shadow-sm hover:bg-muted transition-colors"
          onClick={() => {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            window.location.href = `${baseUrl}/auth/login/google${redirectPath ? `?redirect=${redirectPath}` : ''}`;
          }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;