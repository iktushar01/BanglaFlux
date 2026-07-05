"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VerifyEmailForm from "@/components/modules/auth/VerifyEmailFrom";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return <VerifyEmailForm />;
}

export default function VerifyEmailPage() {
  return (
    /* Next.js requires Suspense when using useSearchParams() 
       to prevent de-opting into client-side rendering for the whole page.
    */
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}