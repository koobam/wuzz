import request from '@http/request';
import { apiUrl } from '@http/url';
import type { StringifiableRecord } from 'query-string';
import {
  LaundryServiceDetailResponse,
  LaundryServicesParams,
  LaundryServicesResponse,
} from './laundry-services.types';

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
): Promise<LaundryServicesResponse> =>
  request(apiUrl('/app/laundry-services/regular', listQuery(params)));

export const laundryServicesAlacarte = (
  params?: LaundryServicesParams,
): Promise<LaundryServicesResponse> =>
  request(apiUrl('/app/laundry-services/alacarte', listQuery(params)));

/** @deprecated Use laundryServicesRegular or laundryServicesAlacarte */
export const laundryServices = laundryServicesRegular;

export const laundryServiceDetail = (
  id: string,
): Promise<LaundryServiceDetailResponse> =>
  request(apiUrl(`/app/laundry-services/${id}`));
