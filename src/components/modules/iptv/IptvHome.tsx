"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { CategoryNav } from "@/components/modules/iptv/CategoryNav";
import { CategoryRow } from "@/components/modules/iptv/CategoryRow";
import { SearchBar } from "@/components/modules/iptv/SearchBar";
import { CHANNEL_CATEGORIES } from "@/lib/channel/constants";
import { useChannels } from "@/hooks/useChannels";
import { ChannelGrid } from "@/components/modules/iptv/ChannelGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? undefined;
  const { data: featuredData, isLoading: featuredLoading } = useChannels({
    category: "SPORTS",
    limit: 1,
  });
  const { data: allData, isLoading: allLoading, isError } = useChannels({
    limit: 1,
    page: 1,
  });
  const { data: searchData, isLoading: searchLoading } = useChannels({
    search,
    limit: 24,
    page: 1,
  });

  const featured = featuredData?.data?.[0];
  const isSearching = Boolean(search?.trim());
  const hasNoChannels =
    !allLoading && !isError && (allData?.meta?.total ?? 0) === 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16">
      {/* Hero */}
      {!isSearching && (
        <section className="relative mb-10 h-[50vh] min-h-[320px] w-full overflow-hidden md:h-[60vh]">
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-12 md:px-8 lg:px-12">
            {featuredLoading ? (
              <Skeleton className="h-32 w-full max-w-xl" />
            ) : featured ? (
              <div className="max-w-2xl space-y-4">
                <p className="text-sm font-medium uppercase tracking-widest text-red-500">
                  Featured Live
                </p>
                <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                  {featured.name}
                </h1>
                <Button asChild size="lg" className="gap-2 bg-red-600 hover:bg-red-700">
                  <Link href={`/watch/${featured.id}`}>
                    <Play className="h-5 w-5 fill-current" />
                    Watch Now
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="max-w-2xl space-y-2">
                <h1 className="text-4xl font-bold text-white md:text-5xl">
                  BanglaFlux
                </h1>
                <p className="text-zinc-400">
                  Live TV streaming — browse channels by category.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="sticky top-0 z-20 border-b border-zinc-900 bg-[#0a0a0a]/95 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center">
          <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
            <SearchBar />
          </Suspense>
          <Suspense fallback={null}>
            <CategoryNav />
          </Suspense>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-4 pt-8 md:px-8">
        {hasNoChannels && !isSearching ? (
          <section className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 p-10 text-center">
            <h2 className="text-xl font-semibold text-white">No channels yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
              An admin needs to upload an M3U playlist first. Go to Admin → Upload
              Playlist, or restart the backend to load the starter sample channels.
            </p>
            <Button asChild className="mt-6 bg-red-600 hover:bg-red-700">
              <Link href="/admin/playlists">Upload Playlist</Link>
            </Button>
          </section>
        ) : isSearching ? (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white">
              Results for &ldquo;{search}&rdquo;
            </h2>
            <ChannelGrid
              channels={searchData?.data ?? []}
              loading={searchLoading}
            />
          </section>
        ) : (
          CHANNEL_CATEGORIES.map((category) => (
            <CategoryRow key={category} category={category} />
          ))
        )}
      </div>
    </div>
  );
}

export default function IptvHome() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] p-8">
          <Skeleton className="mb-8 h-[40vh] w-full" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
