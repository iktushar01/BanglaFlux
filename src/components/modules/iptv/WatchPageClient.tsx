"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { HlsPlayer } from "@/components/modules/iptv/HlsPlayer";
import { FavoriteButton } from "@/components/modules/iptv/FavoriteButton";
import { useChannel } from "@/hooks/useChannels";
import { CATEGORY_LABELS } from "@/lib/channel/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WatchPageClientProps {
  channelId: string;
}

export function WatchPageClient({ channelId }: WatchPageClientProps) {
  const { data: channel, isLoading, isError } = useChannel(channelId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }

  if (isError || !channel) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-background p-8 text-center">
        <p className="text-muted-foreground">Channel not found or unavailable.</p>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <Button asChild variant="ghost" className="mb-4 gap-2 text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <HlsPlayer url={channel.url} title={channel.name} className="mb-6 shadow-lg" />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {channel.name}
              </h1>
              <Badge variant="secondary">
                {CATEGORY_LABELS[channel.category]}
              </Badge>
            </div>
            <p className="max-w-2xl break-all text-xs text-muted-foreground">
              {channel.url}
            </p>
          </div>
          <FavoriteButton channelId={channel.id} />
        </div>
      </div>
    </div>
  );
}
