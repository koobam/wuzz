import { ApiResponse } from '@http/response';

export type OutletsResponse = ApiResponse<OutletsData>;

/** GET /outlets/nearest — single nearest outlet. */
export type NearestOutletResponse = ApiResponse<OutletApi>;

export interface OutletsData {
  next: string;
  outlets: OutletApi[];
}

/** API outlet shape from GET /outlets */
export interface OutletApi {
  id: number;
  name: string;
  address: string;
  category: 'laundry' | 'caffe' | 'all';
  lat: number;
  long: number;
  images?: string[];
  current_status: 'quiet' | 'moderate' | 'busy';
  created_at: string;
  updated_at: string;
  today_open_time: string;
  today_close_time: string;
}

/** Query params: use (lat + long) for nearest, or (cursor + num) for pagination */
export interface OutletsParams {
  /** Latitude (with long: returns 10 nearest) */
  lat?: number;
  /** Longitude (with lat: returns 10 nearest) */
  long?: number;
  /** Pagination cursor (when not using lat/long) */
  cursor?: string;
  /** Page size (default 10, when not using lat/long) */
  num?: number;
  /** Filter by category. Omit or 'all' for no filter. */
  category?: 'laundry' | 'caffe' | 'all';
}

export interface NearestOutletParams {
  lat: number;
  long: number;
}

export type NearestOutletResponse = ApiResponse<NearestOutletData>;

export interface NearestOutletData {
  id: number
  name: string
  address: string
  category: string
  distance_in_km: number
  current_status: string
  delivery_types: string[]
  hours: string[]
}