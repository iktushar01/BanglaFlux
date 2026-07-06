"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CHANNEL_CATEGORIES, CATEGORY_LABELS, categoryToSlug } from "@/lib/channel/constants";
import { cn } from "@/lib/utils";

const pillClass = (active: boolean) =>
  cn(
    "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
    active
      ? "bg-brand text-brand-foreground shadow-sm"
      : "bg-secondary text-secondary-foreground hover:bg-muted",
  );

export function CategoryNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Link
        href="/"
        className={pillClass(pathname === "/" && !activeCategory)}
      >
        All
      </Link>
      {CHANNEL_CATEGORIES.map((category) => {
        const href = `/category/${categoryToSlug(category)}`;
        const isActive = pathname === href;

        return (
          <Link key={category} href={href} className={pillClass(isActive)}>
            {CATEGORY_LABELS[category]}
          </Link>
        );
      })}
    </nav>
  );
}
