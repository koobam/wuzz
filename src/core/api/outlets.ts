import request from '@http/request';
import { apiUrl } from '@http/url';
import type { StringifiableRecord } from 'query-string';
import type { OutletsParams } from './outlets.types';
import type { OutletsResponse } from './outlets.types';

export const outlets = (params?: OutletsParams): Promise<OutletsResponse> => {
  const query: StringifiableRecord = {};
  if (params?.lat != null) query.lat = String(params.lat);
  if (params?.long != null) query.long = String(params.long);
  if (params?.cursor != null) query.cursor = params.cursor;
  if (params?.num != null) query.num = String(params.num);
  return request(apiUrl('/outlets', query));
};
