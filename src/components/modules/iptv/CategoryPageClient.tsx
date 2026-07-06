"use client";

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CategoryNav } from "@/components/modules/iptv/CategoryNav";
import { ChannelGrid } from "@/components/modules/iptv/ChannelGrid";
import { SearchBar } from "@/components/modules/iptv/SearchBar";
import { CATEGORY_LABELS, slugToCategory } from "@/lib/channel/constants";
import { useChannels } from "@/hooks/useChannels";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

interface CategoryPageContentProps {
  slug: string;
}

function CategoryPageContent({ slug }: CategoryPageContentProps) {
  const category = slugToCategory(slug);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? undefined;

  const { data, isLoading, isError } = useChannels({
    category: category ?? undefined,
    search,
    limit: 48,
    page: 1,
  });

  if (!category) notFound();

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="border-b border-border bg-background px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            {CATEGORY_LABELS[category]}
          </h1>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
              <SearchBar basePath={`/category/${slug}`} />
            </Suspense>
            <Suspense fallback={null}>
              <CategoryNav />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        {isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">
            Could not load channels. Make sure the backend server is running on port 5000.
          </div>
        ) : (
          <ChannelGrid channels={data?.data ?? []} loading={isLoading} />
        )}
      </div>
    </div>
  );
}

export function CategoryPageClient({ slug }: CategoryPageContentProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-8">
          <Skeleton className="mb-4 h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <CategoryPageContent slug={slug} />
    </Suspense>
  );
}
