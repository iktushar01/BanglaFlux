"use client";

import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { useFavorites } from "@/hooks/useChannels";
import { ChannelGrid } from "@/components/modules/iptv/ChannelGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FavoritesPage() {
  const { data: favorites, isLoading, isError } = useFavorites();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-brand" />
              Sign in required
            </CardTitle>
            <CardDescription>
              Log in to save and view your favorite channels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="brand" className="w-full">
              <Link href="/login?redirect=/favorites">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="border-b border-border px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
            <Heart className="h-8 w-8 text-brand" />
            My Favorites
          </h1>
          <p className="mt-2 text-muted-foreground">
            {favorites?.length ?? 0} saved channel{(favorites?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        <ChannelGrid channels={favorites ?? []} />
      </div>
    </div>
  );
}
