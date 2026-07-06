"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tv } from "lucide-react";
import type { Channel } from "@/types/channel.types";
import { CATEGORY_LABELS } from "@/lib/channel/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChannelCardProps {
  channel: Channel;
  className?: string;
  priority?: boolean;
}

export function ChannelCard({ channel, className, priority }: ChannelCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/watch/${channel.id}`}
        className="block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-brand/40 hover:shadow-md"
      >
        <div className="relative aspect-[2/3] w-full bg-muted">
          {channel.logo ? (
            <Image
              src={channel.logo}
              alt={channel.name}
              fill
              priority={priority}
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 200px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-background">
              <Tv className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <Badge
              variant="secondary"
              className="mb-2 bg-background/70 text-[10px] uppercase tracking-wide backdrop-blur-sm"
            >
              {CATEGORY_LABELS[channel.category]}
            </Badge>
            <h3 className="line-clamp-2 text-sm font-semibold text-white drop-shadow-md">
              {channel.name}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
