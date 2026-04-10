import { ApiResponse } from '@http/response';

export type MoodsResponse = ApiResponse<MoodsData>;

export interface MoodsData {
  moods: MoodApi[];
}

export interface MoodApi {
  id: number;
  code: string;
  label: string;
  created_at: string;
  updated_at: string;
}
