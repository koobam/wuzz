import request from '@http/request';
import { apiUrl } from '@http/url';
import type { MoodsResponse } from './moods.types';

export const moods = (): Promise<MoodsResponse> => {
  return request(apiUrl('/moods'));
};
