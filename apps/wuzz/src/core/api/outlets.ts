import { apiUrl } from '@http/url';
import type { StringifiableRecord } from 'query-string';
import request from '@http/request';

import type { OutletsParams, NearestOutletResponse, OutletsResponse } from './outlets.types';

export const outlets = (params?: OutletsParams,
  prefetchKey?: string,
  signal?: AbortSignal): Promise<OutletsResponse> => {
  const query: StringifiableRecord = {};
  if (params?.lat != null) query.lat = String(params.lat);
  if (params?.long != null) query.long = String(params.long);
  if (params?.cursor != null) query.cursor = params.cursor;
  if (params?.num != null) query.num = String(params.num);
  if (params?.selected_outlet_id != null) {
    query.selected_outlet_id = String(params.selected_outlet_id);
  }
  return request(apiUrl('/outlets/nearby', query), { signal, prefetchKey });
};

/** Nearest outlet (the single closest). GET /outlets/nearest */
export const outletNearest = (
  params?: OutletsParams,
  prefetchKey?: string,
  signal?: AbortSignal,
): Promise<NearestOutletResponse> => {
  const query: StringifiableRecord = {};
  if (params?.lat != null) query.lat = String(params.lat);
  if (params?.long != null) query.long = String(params.long);
  return request(apiUrl('/outlets/nearest', query), { signal, prefetchKey });
};

