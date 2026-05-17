import request from '@http/request';
import { apiUrl } from '@http/url';
import type { StringifiableRecord } from 'query-string';
import {
  LaundryServiceDetailResponse,
  LaundryServicesParams,
  LaundryServicesResponse,
} from './laundry-services.types';

export const LAUNDRY_SERVICES_ENDPOINTS = {
  regular: '/app/laundry-services/regular',
  alacarte: '/app/laundry-services/alacarte',
  detail: (id: string) => `/app/laundry-services/regular/${id}`,
} as const;

const listQuery = (params?: LaundryServicesParams): StringifiableRecord => {
  const q: StringifiableRecord = {};
  if (params?.num != null) q.num = String(params.num);
  if (params?.include_tiers != null) {
    q.include_tiers = String(params.include_tiers);
  }
  return q;
};

export const laundryServicesRegular = (
  params?: LaundryServicesParams,
  prefetchKey?: string,
  signal?: AbortSignal,
): Promise<LaundryServicesResponse> =>
  request(apiUrl(LAUNDRY_SERVICES_ENDPOINTS.regular, listQuery(params)), { prefetchKey, signal });

export const laundryServicesAlacarte = (
  params?: LaundryServicesParams,
  prefetchKey?: string,
  signal?: AbortSignal,
): Promise<LaundryServicesResponse> =>
  request(apiUrl(LAUNDRY_SERVICES_ENDPOINTS.alacarte, listQuery(params)), { prefetchKey, signal });

/** @deprecated Use laundryServicesRegular or laundryServicesAlacarte */
export const laundryServices = laundryServicesRegular;

export const laundryServiceDetail = (
  id: string,
  prefetchKey?: string,
  signal?: AbortSignal,
): Promise<LaundryServiceDetailResponse> =>
  request(apiUrl(LAUNDRY_SERVICES_ENDPOINTS.detail(id)), { prefetchKey, signal });
