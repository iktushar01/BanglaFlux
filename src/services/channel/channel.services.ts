"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type {
  AdminStats,
  Channel,
  ChannelQueryParams,
  CreateChannelInput,
  FavoriteToggleResult,
  PlaylistImportResult,
  UpdateChannelInput,
} from "@/types/channel.types";
import type { ApiResponse, PaginationMeta } from "@/types/api.types";

const buildQuery = (params?: ChannelQueryParams) => {
  const searchParams = new URLSearchParams();
  if (!params) return "";

  if (params.category) searchParams.set("category", params.category);
  if (params.search) searchParams.set("search", params.search);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.isActive !== undefined)
    searchParams.set("isActive", String(params.isActive));

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

export async function getChannels(params?: ChannelQueryParams) {
  const res = await httpClient.get<Channel[]>(
    `/channels${buildQuery(params)}`,
  );
  return res as ApiResponse<Channel[]> & { meta?: PaginationMeta };
}

export async function getChannelById(id: string) {
  const res = await httpClient.get<Channel>(`/channels/${id}`);
  return res.data;
}

export async function getAdminChannelById(id: string) {
  const res = await httpClient.get<Channel>(`/admin/channel/${id}`);
  return res.data;
}

export async function getAdminChannels(params?: ChannelQueryParams) {
  const res = await httpClient.get<Channel[]>(
    `/admin/channels${buildQuery(params)}`,
  );
  return res as ApiResponse<Channel[]> & { meta?: PaginationMeta };
}

export async function getAdminStats() {
  const res = await httpClient.get<AdminStats>("/admin/stats");
  return res.data;
}

export async function createChannel(input: CreateChannelInput) {
  const res = await httpClient.post<Channel>("/admin/channel", input);
  return res.data;
}

export async function updateChannel(id: string, input: UpdateChannelInput) {
  const res = await httpClient.put<Channel>(`/admin/channel/${id}`, input);
  return res.data;
}

export async function deleteChannel(id: string) {
  await httpClient.delete(`/admin/channel/${id}`);
}

export async function toggleChannelActive(id: string) {
  const res = await httpClient.patch<Channel>(`/admin/channel/${id}/toggle`, {});
  return res.data;
}

export async function importPlaylistFromUrl(title: string, url: string) {
  const res = await httpClient.post<PlaylistImportResult>("/admin/playlist/url", {
    title,
    url,
  });
  return res.data;
}

export async function importPlaylistFromFile(formData: FormData) {
  const res = await httpClient.post<PlaylistImportResult>(
    "/admin/playlist/upload",
    formData,
  );
  return res.data;
}

export async function getFavorites() {
  const res = await httpClient.get<Channel[]>("/user/favorites");
  return res.data ?? [];
}

export async function toggleFavorite(channelId: string) {
  const res = await httpClient.post<FavoriteToggleResult>(
    `/user/favorite/${channelId}`,
    {},
  );
  return res.data;
}
