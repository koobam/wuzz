import { API_V1, apiUrl } from '@http/url';
import request from '@http/request';

import type { MemberSummaryResponse } from './member.types';

/** The signed-in customer's level, points, vouchers and wallet. GET /app/v1/me/summary */
export const memberSummary = (
  prefetchKey?: string,
  signal?: AbortSignal,
): Promise<MemberSummaryResponse> =>
  request(apiUrl(`${API_V1}/me/summary`), { signal, prefetchKey });
