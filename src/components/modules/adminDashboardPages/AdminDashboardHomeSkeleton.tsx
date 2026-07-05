import { Skeleton } from "@/components/ui/skeleton";

const MetricCardSkeleton = () => (
  <div className="rounded-[2rem] border border-border/40 bg-card/20 p-7">
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-12 rounded-2xl bg-primary/15" />
        <Skeleton className="h-4 w-4 rounded-full bg-muted/60" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-24 rounded-full bg-muted/60" />
        <Skeleton className="h-10 w-24 rounded-2xl bg-muted/80" />
        <Skeleton className="h-3 w-32 rounded-full bg-muted/50" />
      </div>
    </div>
  </div>
);

const WorkspaceSkeleton = () => (
  <div className="flex items-center justify-between rounded-3xl border border-border/40 bg-background/50 p-6">
    <div className="flex items-center gap-5">
      <Skeleton className="h-14 w-14 rounded-2xl bg-muted/70" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-28 rounded-xl bg-muted/70" />
        <Skeleton className="h-3 w-36 rounded-full bg-muted/50" />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="space-y-2 text-right">
        <Skeleton className="h-3 w-14 rounded-full bg-muted/50" />
        <Skeleton className="h-7 w-10 rounded-lg bg-muted/70" />
      </div>
      <Skeleton className="h-5 w-5 rounded-full bg-primary/20" />
    </div>
  </div>
);

const ActivityCardSkeleton = () => (
  <div className="rounded-3xl border border-border/40 bg-card/40 p-6">
    <div className="mb-4 flex items-center justify-between">
      <Skeleton className="h-10 w-10 rounded-xl bg-primary/20" />
      <Skeleton className="h-5 w-16 rounded-full bg-muted/60" />
    </div>
    <Skeleton className="h-6 w-3/4 rounded-xl bg-muted/80" />
    <Skeleton className="mt-2 h-3 w-1/2 rounded-full bg-muted/50" />
    <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
      <Skeleton className="h-3 w-20 rounded-full bg-muted/50" />
      <Skeleton className="h-4 w-4 rounded-full bg-primary/20" />
    </div>
  </div>
);

const AdminDashboardHomeSkeleton = () => {
  return (
    <div className="admin-shell relative min-h-screen space-y-8 p-4 sm:p-8 lg:p-10">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/30 p-8 md:p-12 backdrop-blur-2xl">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-7 w-32 rounded-lg bg-primary/20" />
              <Skeleton className="h-4 w-24 rounded-full bg-muted/50" />
            </div>
            <Skeleton className="h-14 w-full max-w-[430px] rounded-3xl bg-muted/80" />
            <Skeleton className="h-4 w-full max-w-[480px] rounded-full bg-muted/50" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-7 w-28 rounded-md bg-muted/50"
                />
              ))}
            </div>
          </div>

          <div className="grid shrink-0 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-4"
              >
                <Skeleton className="h-10 w-10 rounded-xl bg-primary/15" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded-full bg-muted/50" />
                  <Skeleton className="h-4 w-24 rounded-full bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-border/40 bg-card/20 p-8">
          <div className="mb-10 flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-full bg-muted/50" />
              <Skeleton className="h-9 w-64 rounded-2xl bg-muted/80" />
              <Skeleton className="h-3 w-72 rounded-full bg-muted/50" />
            </div>
            <Skeleton className="h-14 w-14 rounded-2xl bg-primary/15" />
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24 rounded-full bg-muted/50" />
                <Skeleton className="h-3 w-12 rounded-full bg-primary/20" />
              </div>
              <Skeleton className="h-3 w-full rounded-full bg-muted/40" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/40 p-5 shadow-inner"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full bg-muted/60" />
                    <Skeleton className="h-3 w-16 rounded-full bg-muted/50" />
                  </div>
                  <Skeleton className="h-8 w-14 rounded-xl bg-muted/70" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full bg-muted/50" />
            <Skeleton className="h-8 w-32 rounded-xl bg-muted/80" />
          </div>

          {Array.from({ length: 2 }).map((_, index) => (
            <WorkspaceSkeleton key={index} />
          ))}

          <div className="mt-auto rounded-2xl border border-dashed border-border/60 p-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full bg-primary/20" />
              <Skeleton className="h-3 w-48 rounded-full bg-muted/50" />
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-full bg-muted/50" />
          <Skeleton className="h-9 w-64 rounded-2xl bg-muted/80" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ActivityCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardHomeSkeleton;
