export type ChannelCategory =
  | "SPORTS"
  | "MOVIES"
  | "NEWS"
  | "ENTERTAINMENT"
  | "MUSIC"
  | "CARTOON"
  | "BANGLADESH"
  | "DOCUMENTARY"
  | "SERIES"
  | "OTHER";

export interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string | null;
  category: ChannelCategory;
  isActive: boolean;
  createdAt: string;
  playlistId?: string | null;
}

export interface ChannelQueryParams {
  category?: ChannelCategory;
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface PlaylistImportResult {
  playlistId: string;
  imported: number;
  skipped: number;
  invalid: number;
  total: number;
}

export interface AdminStats {
  total: number;
  active: number;
  inactive: number;
  playlists: number;
}

export interface FavoriteToggleResult {
  favorited: boolean;
  channelId: string;
}

export interface CreateChannelInput {
  name: string;
  url: string;
  logo?: string;
  category?: ChannelCategory;
  isActive?: boolean;
}

export type UpdateChannelInput = Partial<CreateChannelInput>;
