import request from '@http/request';
import { API_V1, apiUrl } from '@http/url';
import type { MoodsResponse } from './moods.types';

export const moods = (): Promise<MoodsResponse> => {
  return request(apiUrl(`${API_V1}/moods`));
};
