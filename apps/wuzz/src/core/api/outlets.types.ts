import { ApiResponse } from '@http/response';

export type OutletsResponse = ApiResponse<OutletsData>;

export interface OutletsData {
  next: string;
  outlets: OutletApi[];
}

/** API outlet shape from GET /outlets (list & nearby). */
export interface OutletApi {
  id: number;
  name: string;
  address: string;
  category: 'laundry' | 'caffe' | 'all';
  lat?: number;
  long?: number;
  images?: string[];
  current_status: 'quiet' | 'moderate' | 'busy';
  /** Jarak dari lokasi user dalam km. */
  distance_in_km?: number;
  fulfillment?: string;
  /** Kode metode pemenuhan, mis. ["pickup", "delivery"]. */
  delivery_types?: string[];
  /** [open, close] sebagai ISO wall-clock, mis. ["0000-01-01T08:00:00Z", "0000-01-01T22:00:00Z"]. */
  hours?: string[];
  created_at?: string;
  updated_at?: string;
}

/** Query params. Without lat/long outlets come back by name; (cursor + num) pages through them. */
export interface OutletsParams {
  /** Latitude (with long: sorts nearest first and fills distance_in_km) */
  lat?: number;
  /** Longitude (with lat: sorts nearest first and fills distance_in_km) */
  long?: number;
  /** Pagination cursor (when not using lat/long) */
  cursor?: string;
  /** Page size (default 10, max 50) */
  num?: number;
  /** Outlet terpilih → backend menaruhnya di urutan atas daftar. */
  selected_outlet_id?: number;
}
