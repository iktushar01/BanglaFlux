"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ChannelCategory } from "@/types/channel.types";
import { CATEGORY_LABELS, categoryToSlug } from "@/lib/channel/constants";
import { useCategoryChannels } from "@/hooks/useChannels";
import { ChannelCard } from "./ChannelCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryRowProps {
  category: ChannelCategory;
}

export function CategoryRow({ category }: CategoryRowProps) {
  const { data, isLoading, isError } = useCategoryChannels(category, 12);
  const channels = data?.data ?? [];

  if (isError) return null;
  if (!isLoading && channels.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          {CATEGORY_LABELS[category]}
        </h2>
        <Link
          href={`/category/${categoryToSlug(category)}`}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          See all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-32 shrink-0 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {channels.map((channel) => (
            <div key={channel.id} className="w-36 shrink-0 md:w-40">
              <ChannelCard channel={channel} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
