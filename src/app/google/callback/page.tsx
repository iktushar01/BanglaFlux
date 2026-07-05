"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const completeGoogleLogin = async () => {
      try {
        const code = searchParams.get("code");
        const redirectPath = searchParams.get("redirect") || "/dashboard";
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
          router.replace("/login?error=missing_api_base_url");
          return;
        }

        if (!code) {
          router.replace("/login?error=missing_oauth_code");
          return;
        }

        const exchangeResponse = await fetch(
          `${apiBaseUrl}/auth/oauth/code?code=${encodeURIComponent(code)}`,
          { method: "GET" }
        );

        if (!exchangeResponse.ok) {
          router.replace("/login?error=oauth_exchange_failed");
          return;
        }

        const exchangePayload = await exchangeResponse.json();

        const completeResponse = await fetch("/api/auth/oauth/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...exchangePayload.data,
            redirectPath,
          }),
        });

        if (!completeResponse.ok) {
          router.replace("/login?error=oauth_cookie_sync_failed");
          return;
        }

        const completePayload = await completeResponse.json();
        router.replace(completePayload.redirectTo || "/dashboard");
      } catch (error) {
        console.error("Google login completion failed:", error);
        router.replace("/login?error=oauth_completion_failed");
      }
    };

    void completeGoogleLogin();
  }, [router, searchParams]);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      {/* Strictly Clean & Centered Container */}
      <div className="w-full max-w-[360px] text-center space-y-4">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight">Completing sign in</h1>
          <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-normal">
            Verifying your session credentials and synchronizing your workspace...
          </p>
        </div>

        {/* Minimal Progress/Status Box */}
        <div className="pt-2">
          <div className="rounded-md border border-border bg-muted/30 px-3 py-2.5 text-left">
            <div className="flex items-center justify-between text-xs font-medium text-foreground">
              <span>Redirect status</span>
              <span className="text-primary animate-pulse font-normal">Handoff processing</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GoogleCallbackPage;