import type { ChannelCategory } from "@/types/channel.types";

export const CHANNEL_CATEGORIES: ChannelCategory[] = [
  "SPORTS",
  "MOVIES",
  "NEWS",
  "ENTERTAINMENT",
  "MUSIC",
  "CARTOON",
  "BANGLADESH",
  "DOCUMENTARY",
  "SERIES",
  "OTHER",
];

export const CATEGORY_LABELS: Record<ChannelCategory, string> = {
  SPORTS: "Sports",
  MOVIES: "Movies",
  NEWS: "News",
  ENTERTAINMENT: "Entertainment",
  MUSIC: "Music",
  CARTOON: "Cartoon",
  BANGLADESH: "Bangladesh",
  DOCUMENTARY: "Documentary",
  SERIES: "Series",
  OTHER: "Other",
};

export const categoryToSlug = (category: ChannelCategory) =>
  category.toLowerCase().replace(/_/g, "-");

export const slugToCategory = (slug: string): ChannelCategory | null => {
  const normalized = slug.toUpperCase().replace(/-/g, "_");
  return CHANNEL_CATEGORIES.includes(normalized as ChannelCategory)
    ? (normalized as ChannelCategory)
    : null;
};
