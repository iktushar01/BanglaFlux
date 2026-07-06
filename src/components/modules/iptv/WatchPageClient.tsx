"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { HlsPlayer } from "@/components/modules/iptv/HlsPlayer";
import { FavoriteButton } from "@/components/modules/iptv/FavoriteButton";
import { ChannelCard } from "@/components/modules/iptv/ChannelCard";
import { CategoryRow } from "@/components/modules/iptv/CategoryRow";
import { useCategoryChannels, useChannel } from "@/hooks/useChannels";
import { CATEGORY_LABELS, CHANNEL_CATEGORIES, categoryToSlug } from "@/lib/channel/constants";
import type { Channel, ChannelCategory } from "@/types/channel.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface WatchPageClientProps {
  channelId: string;
}

function RelatedChannels({ channel }: { channel: Channel }) {
  const { data, isLoading } = useCategoryChannels(channel.category, 24);
  const related = (data?.data ?? [])
    .filter((item) => item.id !== channel.id)
    .slice(0, 12);

  if (!isLoading && related.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 space-y-4 border-t border-border pt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          More from {CATEGORY_LABELS[channel.category]}
        </h2>
        <Link
          href={`/category/${categoryToSlug(channel.category)}`}
          className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          See all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-32 shrink-0 rounded-xl md:w-40" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {related.map((item) => (
            <div key={item.id} className="w-36 shrink-0 md:w-40">
              <ChannelCard channel={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ExploreCategories({ currentCategory }: { currentCategory: ChannelCategory }) {
  const otherCategories = CHANNEL_CATEGORIES.filter(
    (category) => category !== currentCategory,
  );

  return (
    <section className="mt-10 space-y-10 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-foreground md:text-2xl">
        Explore more categories
      </h2>
      <div className="space-y-12">
        {otherCategories.map((category) => (
          <CategoryRow key={category} category={category} />
        ))}
      </div>
    </section>
  );
}

function WatchContent({ channel }: { channel: Channel }) {
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

        <RelatedChannels channel={channel} />
        <ExploreCategories currentCategory={channel.category} />
      </div>
    </div>
  );
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

  return <WatchContent channel={channel} />;
}
