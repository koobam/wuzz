import { API_V1, apiUrl } from '@http/url';
import type { StringifiableRecord } from 'query-string';
import request from '@http/request';

import type { OutletsParams, OutletsResponse } from './outlets.types';

/** Outlets, by name (or nearest first when lat + long are given). GET /app/v1/outlets/nearby */
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
  return request(apiUrl(`${API_V1}/outlets/nearby`, query), { signal, prefetchKey });
};
