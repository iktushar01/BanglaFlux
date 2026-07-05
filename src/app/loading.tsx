"use client";

import { Loader2 } from "lucide-react";

const GlobalLoading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background p-4">
      {/* Strictly Clean & Centered Minimal Loading Interface */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
        <p className="text-xs text-muted-foreground animate-pulse tracking-wide font-medium">
          Loading workspace...
        </p>
      </div>
    </div>
  );
};

export default GlobalLoading;