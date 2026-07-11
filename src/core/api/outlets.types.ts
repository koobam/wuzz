import { ApiResponse } from '@http/response';

export type OutletsResponse = ApiResponse<OutletsData>;

/** GET /outlets/nearest — single nearest outlet. */
export type NearestOutletResponse = ApiResponse<OutletApi>;

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
  /** Outlet terpilih → backend menaruhnya di urutan atas daftar. */
  selected_outlet_id?: number;
}
