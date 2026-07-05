"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToggleFavorite, useFavorites } from "@/hooks/useChannels";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FavoriteButtonProps {
  channelId: string;
  className?: string;
}

export function FavoriteButton({ channelId, className }: FavoriteButtonProps) {
  const { data: favorites, isError } = useFavorites();
  const { mutate, isPending } = useToggleFavorite();

  const isFavorited = favorites?.some((c) => c.id === channelId) ?? false;

  const handleClick = () => {
    if (isError) {
      toast.error("Sign in to save favorites");
      return;
    }

    mutate(channelId, {
      onSuccess: (data) => {
        toast.success(data?.favorited ? "Added to favorites" : "Removed from favorites");
      },
      onError: () => {
        toast.error("Could not update favorites. Please sign in.");
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800",
        isFavorited && "border-red-600 text-red-500",
        className,
      )}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
    </Button>
  );
}
