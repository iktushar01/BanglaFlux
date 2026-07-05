"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, RefreshCw, Timer } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { verifyEmailAction } from "@/actions/authActions/_verifyEmailAction";

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "your email";

  // States
  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isResending, setIsResending] = useState(false);

  // Timer Countdown Logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  // Helper to format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (otp: string) => verifyEmailAction({ email, otp }),
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (timeLeft <= 0) {
      setServerError("OTP has expired. Please request a new one.");
      return;
    }

    try {
      const result = await mutateAsync(otp);

      if (result?.success) {
        router.push("/login?verified=true");
      } else {
        setServerError(result?.message || "Invalid or expired code");
      }
    } catch (error: any) {
      setServerError("A network error occurred.");
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setServerError(null);
    try {
      // Logic for resending OTP would go here (calling a server action)
      // await resendOtpAction(email); 
      
      setTimeLeft(900); // Reset timer to 15 mins
      setOtp(""); // Clear input
      console.log("New OTP sent to:", email);
    } catch (error: any) {
      setServerError("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      {/* Absolute Back Route Navigation */}
      <nav className="absolute top-4 left-4 z-20">
        <Link href="/register">
          <Button variant="ghost" size="sm" className="group gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </Button>
        </Link>
      </nav>

      {/* Strictly Clean & Centered Container */}
      <div className="w-full max-w-[360px] space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Verify Identity</h1>
          <p className="text-sm text-muted-foreground break-all">
            We sent a verification token to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="flex flex-col items-center justify-center gap-2">
            <Label className="text-xs text-muted-foreground">
              6-Digit Security Code
            </Label>
            
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={timeLeft <= 0}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    // Standard raw shadcn sizing specs
                    className="h-10 w-10 text-base"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {/* Countdown State Wrapper */}
            <div className={`flex items-center gap-1.5 text-xs ${timeLeft < 60 ? "text-destructive animate-pulse font-medium" : "text-muted-foreground"}`}>
              <Timer className="h-3.5 w-3.5" />
              <span>Code expires in: {formatTime(timeLeft)}</span>
            </div>
          </div>

          {serverError && (
            <Alert variant="destructive" className="rounded-md py-2.5">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <AppSubmitButton
            isPending={isPending}
            pendingLabel="Verifying..."
            disabled={otp.length !== 6 || isPending || timeLeft <= 0}
            className="w-full rounded-md"
          >
            Verify Account
          </AppSubmitButton>
        </form>

        {/* Minimal Bottom Action Split */}
        <div className="space-y-3 text-center pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Didn't receive the link or token expired?
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs h-9"
            onClick={handleResendOtp}
            disabled={isResending || isPending || (timeLeft > 840)}
          >
            <RefreshCw className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`} />
            {isResending ? "Requesting..." : "Resend code"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmailForm;