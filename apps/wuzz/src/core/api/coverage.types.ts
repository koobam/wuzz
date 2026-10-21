import { ApiResponse } from '@http/response';

export interface CoverageArea {
  id: number;
  /** e.g. "Jakarta Barat" */
  name: string;
}

/** `covered` is false (and `area` null) when the position is outside every service area. */
export interface CoverageData {
  covered: boolean;
  area: CoverageArea | null;
}

export type CoverageResponse = ApiResponse<CoverageData>;

export interface CoverageParams {
  lat: number;
  long: number;
}
