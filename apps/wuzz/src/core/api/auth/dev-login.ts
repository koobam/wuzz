import request from '@http/request';
import { API_V1, apiUrl } from '@http/url';

import type { VerifyOtpResponse } from './verify-otp.types';

/**
 * DEVELOPMENT ONLY. Signs an existing customer in by phone with no code, so the
 * simulator gets a real session. The backend serves this only when it runs with
 * APP_ENV=dev; anywhere else it is a 404.
 */
export const devLogin = (phone: string): Promise<VerifyOtpResponse> =>
  request(apiUrl(`${API_V1}/dev/login`), {
    method: 'POST',
    data: { phone },
  });
