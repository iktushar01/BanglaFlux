"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CHANNEL_CATEGORIES, CATEGORY_LABELS, categoryToSlug } from "@/lib/channel/constants";
import { cn } from "@/lib/utils";

export function CategoryNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Link
        href="/"
        className={cn(
          "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          pathname === "/" && !activeCategory
            ? "bg-red-600 text-white"
            : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
        )}
      >
        All
      </Link>
      {CHANNEL_CATEGORIES.map((category) => {
        const href = `/category/${categoryToSlug(category)}`;
        const isActive = pathname === href;

        return (
          <Link
            key={category}
            href={href}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-red-600 text-white"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
            )}
          >
            {CATEGORY_LABELS[category]}
          </Link>
        );
      })}
    </nav>
  );
}
