import { fetch as nitroFetch } from 'react-native-nitro-fetch';
import { Platform } from 'react-native';
import {
  getBrand,
  getDeviceName,
  getModel,
  getUniqueId,
  getUserAgent,
} from 'react-native-device-info';
import { NetworkInfo } from 'react-native-network-info';
import { ACCESS_TOKEN_STORAGE, REFRESH_TOKEN_STORAGE, storage } from './storage';
import apiUrl from './url';

type RequestOptions = {
  method?: string;
  data?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  prefetchKey?: string;
  signal?: AbortSignal;
};

type TokenData = {
  accessToken: string;
  refreshToken: string;
};

let isRefreshing = false;
let refreshTokenPromise: Promise<TokenData> | null = null;

// Cached once on first request — getUserAgent() spins a WKWebView on iOS
let cachedDeviceHeaders: Record<string, string> | null = null;

const NS_URL_ERROR_MESSAGES: Record<number, string> = {
  [-1001]: 'Request timed out. Please try again.',
  [-1003]: 'Server not found. Check your connection.',
  [-1004]: 'Could not connect to the server.',
  [-1005]: 'Network connection was lost.',
  [-1009]: 'No internet connection.',
  [-1011]: 'Server returned an invalid response.',
  [-1012]: 'SSL handshake failed.',
  [-1200]: 'Secure connection failed.',
};

function parseNetworkError(err: unknown): Error {
  const message = err instanceof Error ? err.message : String(err);
  const codeMatch = message.match(/Code=(-?\d+)/);
  if (codeMatch) {
    const code = parseInt(codeMatch[1], 10);
    const readable = NS_URL_ERROR_MESSAGES[code];
    if (readable) return Object.assign(new Error(readable), { code });
  }
  // Android: java.net.ConnectException etc.
  if (message.includes('ECONNREFUSED') || message.includes('ConnectException')) {
    return new Error('Could not connect to the server.');
  }
  if (message.includes('ETIMEDOUT') || message.includes('SocketTimeoutException')) {
    return new Error('Request timed out. Please try again.');
  }
  if (message.includes('ENOTFOUND') || message.includes('UnknownHostException')) {
    return new Error('Server not found. Check your connection.');
  }
  return err instanceof Error ? err : new Error(message);
}

async function getDeviceHeaders(): Promise<Record<string, string>> {
  if (cachedDeviceHeaders) return cachedDeviceHeaders;

  const [deviceID, ipAddress, deviceName, userAgent] = await Promise.all([
    getUniqueId().catch(() => null),
    NetworkInfo.getIPAddress().catch(() => null),
    getDeviceName().catch(() => null),
    getUserAgent().catch(() => null),
  ]);

  if (!deviceID || !ipAddress) return {};

  cachedDeviceHeaders = {
    DeviceID: deviceID,
    DeviceBrand: getBrand(),
    DeviceName: deviceName ?? '',
    DeviceModel: getModel(),
    Platform: Platform.OS,
    IPAddress: ipAddress,
    ...(userAgent ? { 'User-Agent': userAgent } : {}),
  };

  return cachedDeviceHeaders;
}

export async function buildHeaders(extra?: Record<string, string>): Promise<Record<string, string>> {
  const authToken = storage.getString(ACCESS_TOKEN_STORAGE);
  const deviceHeaders = await getDeviceHeaders();

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...deviceHeaders,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...extra,
  };
}

async function doRefreshTokens(): Promise<TokenData> {
  const headers = await buildHeaders();
  const response = await nitroFetch(apiUrl('/refresh'), {
    method: 'POST',
    headers,
    body: JSON.stringify({ refreshToken: storage.getString(REFRESH_TOKEN_STORAGE) }),
  });
  const json = await response.json() as { data: TokenData };
  const tokenData = json.data;
  if (!tokenData) throw new Error('Failed to refresh token: No data received');
  storage.set(ACCESS_TOKEN_STORAGE, tokenData.accessToken);
  storage.set(REFRESH_TOKEN_STORAGE, tokenData.refreshToken);
  return tokenData;
}

async function executeRequest(
  url: string,
  options: RequestOptions,
  retried = false,
): Promise<unknown> {
  const { method = 'GET', data, headers: extraHeaders, prefetchKey, signal } = options;
  const headers = await buildHeaders({
    ...extraHeaders,
    ...(prefetchKey ? { prefetchKey } : undefined),
  });

  let response: Awaited<ReturnType<typeof nitroFetch>>;
  try {
    response = await nitroFetch(url, {
      method,
      headers,
      body: data != null ? JSON.stringify(data) : undefined,
      signal,
    });
  } catch (err) {
    throw parseNetworkError(err);
  }

  if (response.status === 401 && !retried && !url.includes('/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenPromise = doRefreshTokens().finally(() => {
        isRefreshing = false;
        refreshTokenPromise = null;
      });
    }

    const tokenData = await refreshTokenPromise!;
    return executeRequest(
      url,
      {
        ...options,
        headers: { ...extraHeaders, Authorization: `Bearer ${tokenData.accessToken}` },
      },
      true,
    );
  }

  const json = await response.json();

  if (!response.ok) {
    return Promise.reject(json);
  }

  return json;
}

const nitroRequest = <T = unknown>(url?: string, options?: RequestOptions): Promise<T> => {
  if (!url) return Promise.reject(new Error('URL is required'));
  return executeRequest(url, options ?? {}) as Promise<T>;
};

import axiosRequest from './axios';

const USE_AXIOS = false;

const request = USE_AXIOS
  ? (url?: string, options?: RequestOptions) => axiosRequest(url, options)
  : nitroRequest;

export default request;
