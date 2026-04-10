import { ApiResponse } from '@http/response';

export type LaundryServicesResponse = ApiResponse<LaundryServicesData>;

export type LaundryServiceDetailResponse = ApiResponse<LaundryService>;

/** Error payload from laundry service detail API (for UI: title + description). */
export interface LaundryServiceDetailErrorData {
  image: string;
  title: string;
  description: string;
}

/** Error response shape when laundry service detail fails (data holds user-facing copy). */
export type LaundryServiceDetailErrorResponse = ApiResponse<LaundryServiceDetailErrorData>;

export interface LaundryServicesData {
  laundry_services: LaundryService[];
  next: string;
}

export interface LaundryServiceAddon {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  discount_type: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface LaundryService {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  service_type: 'kiloan' | 'satuan';
  min_kg?: number;
  max_kg?: number;
  discount: number;
  discount_type: string;
  icon: string;
  image?: string;
  created_at: string;
  updated_at: string;
  addons?: LaundryServiceAddon[];
}

export interface LaundryServicesParams {
  num?: number;
  include_tiers?: boolean;
}
