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
      <div className="flex min-h-[50vh] items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#0a0a0a] p-4">
        <Card className="max-w-md border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Sign in required
            </CardTitle>
            <CardDescription>
              Log in to save and view your favorite channels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
              <Link href="/login?redirect=/favorites">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16">
      <div className="border-b border-zinc-900 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
            <Heart className="h-8 w-8 text-red-500" />
            My Favorites
          </h1>
          <p className="mt-2 text-zinc-400">
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
