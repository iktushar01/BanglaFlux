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
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/watch/${channel.id}`}
        className="block overflow-hidden rounded-lg border border-white/5 bg-zinc-900/80 shadow-lg transition-shadow group-hover:shadow-red-900/20 group-hover:shadow-2xl"
      >
        <div className="relative aspect-[2/3] w-full bg-zinc-950">
          {channel.logo ? (
            <Image
              src={channel.logo}
              alt={channel.name}
              fill
              priority={priority}
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 200px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
              <Tv className="h-12 w-12 text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <Badge
              variant="secondary"
              className="mb-2 bg-black/50 text-[10px] uppercase tracking-wide text-zinc-300"
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
