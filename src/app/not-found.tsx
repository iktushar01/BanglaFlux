import Link from "next/link";
import { Home, MoveLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] animate-pulse rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] animate-pulse rounded-full bg-blue-500/10 blur-[120px] [animation-delay:2s]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl space-y-8 text-center">
        <div className="relative inline-block">
          <h1 className="text-[12rem] leading-none font-black tracking-tighter text-transparent select-none md:text-[18rem] bg-gradient-to-b from-foreground to-foreground/10 bg-clip-text">
            404
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            Page not found
          </h2>
          <p className="mx-auto max-w-md text-lg font-medium text-muted-foreground">
            The page you requested does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Button
            variant="default"
            size="lg"
            asChild
            className="h-14 rounded-2xl px-8 text-base font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.reload()}
            className="h-14 rounded-2xl bg-background/50 px-8 text-base font-bold backdrop-blur-md transition-all hover:bg-muted"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
        </div>

        <div className="pt-12">
          <Link
            href="/dashboard"
            className="group flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-orange-500"
          >
            <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
