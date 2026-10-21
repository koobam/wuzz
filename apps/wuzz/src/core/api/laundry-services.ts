import request from '@http/request';
import { API_V1, apiUrl } from '@http/url';
import type { StringifiableRecord } from 'query-string';
import {
  LaundryServiceDetailResponse,
  LaundryServicesParams,
  LaundryServicesResponse,
  ServiceCategory,
} from './laundry-services.types';

const listQuery = (
  category: ServiceCategory,
  params?: LaundryServicesParams,
): StringifiableRecord => {
  const q: StringifiableRecord = { service_category: category };
  if (params?.num != null) q.num = String(params.num);
  if (params?.include_tiers != null) {
    q.include_tiers = String(params.include_tiers);
  }
  return q;
};

/**
 * List services, filtered by category (`regular` or `alacarte`).
 * GET /services?service_category=<category>
 */
export const laundryServices = (
  category: ServiceCategory,
  params?: LaundryServicesParams,
  prefetchKey?: string,
  signal?: AbortSignal,
): Promise<LaundryServicesResponse> =>
  request(apiUrl(`${API_V1}/services`, listQuery(category, params)), { signal, prefetchKey });

export const laundryServiceDetail = (
  id: string,
  prefetchKey?: string,
  signal?: AbortSignal,
): Promise<LaundryServiceDetailResponse> =>
  request(apiUrl(`${API_V1}/services/${id}`), { signal, prefetchKey });
