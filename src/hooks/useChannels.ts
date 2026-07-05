"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChannelCategory, ChannelQueryParams } from "@/types/channel.types";

/** Same-origin proxy routes — avoids browser CORS to Express backend */
const PUBLIC_API = "/api";

async function clientFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${PUBLIC_API}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? `Request failed: ${res.status}`,
    );
  }

  return res.json();
}

const buildQuery = (params?: ChannelQueryParams) => {
  const searchParams = new URLSearchParams();
  if (!params) return "";

  if (params.category) searchParams.set("category", params.category);
  if (params.search) searchParams.set("search", params.search);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

export function useChannels(params?: ChannelQueryParams) {
  return useQuery({
    queryKey: ["channels", params],
    queryFn: async () => {
      const json = await clientFetch<{
        success: boolean;
        data: import("@/types/channel.types").Channel[];
        meta?: import("@/types/api.types").PaginationMeta;
      }>(`/channels${buildQuery(params)}`);
      return json;
    },
    retry: 2,
  });
}

export function useChannel(id: string) {
  return useQuery({
    queryKey: ["channel", id],
    queryFn: async () => {
      const json = await clientFetch<{
        success: boolean;
        data: import("@/types/channel.types").Channel;
      }>(`/channels/${id}`);
      return json.data;
    },
    enabled: Boolean(id),
  });
}

export function useCategoryChannels(category: ChannelCategory, limit = 12) {
  return useChannels({ category, limit, page: 1 });
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function backendFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  if (!API_BASE) throw new Error("API base URL is not configured");

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const json = await backendFetch<{
        success: boolean;
        data: import("@/types/channel.types").Channel[];
      }>("/user/favorites");
      return json.data ?? [];
    },
    retry: false,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId: string) => {
      const json = await backendFetch<{
        success: boolean;
        data: { favorited: boolean; channelId: string };
      }>(`/user/favorite/${channelId}`, { method: "POST", body: "{}" });
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useAdminChannels(params?: ChannelQueryParams) {
  return useQuery({
    queryKey: ["admin-channels", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set("category", params.category);
      if (params?.search) searchParams.set("search", params.search);
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.isActive !== undefined)
        searchParams.set("isActive", String(params.isActive));

      const qs = searchParams.toString();
      const json = await backendFetch<{
        success: boolean;
        data: import("@/types/channel.types").Channel[];
        meta?: import("@/types/api.types").PaginationMeta;
      }>(`/admin/channels${qs ? `?${qs}` : ""}`);
      return json;
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const json = await backendFetch<{
        success: boolean;
        data: import("@/types/channel.types").AdminStats;
      }>("/admin/stats");
      return json.data;
    },
  });
}
