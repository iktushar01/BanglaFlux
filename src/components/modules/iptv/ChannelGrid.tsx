import type { Channel } from "@/types/channel.types";
import { ChannelCard } from "./ChannelCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelGridProps {
  channels: Channel[];
  loading?: boolean;
}

export function ChannelGrid({ channels, loading }: ChannelGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground">
        No channels found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {channels.map((channel, index) => (
        <ChannelCard
          key={channel.id}
          channel={channel}
          priority={index < 6}
        />
      ))}
    </div>
  );
}
