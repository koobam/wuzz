import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import { getBrand, getDeviceName, getUniqueId } from 'react-native-device-info';
import { NetworkInfo } from 'react-native-network-info';
import { ACCESS_TOKEN_STORAGE, REFRESH_TOKEN_STORAGE, storage } from './storage';
import apiUrl from './url';

const baseRequest = axios.create({
  withCredentials: true,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 4000,
});

// === REQUEST INTERCEPTOR ===
baseRequest.interceptors.request.use(
  async (config) => {
    const authToken = storage.getString(ACCESS_TOKEN_STORAGE);

    const deviceID = await getUniqueId().catch(() => null);
    const ipAddress = await NetworkInfo.getIPAddress().catch(() => null);
    const deviceName = await getDeviceName().catch(() => null);

    if (deviceID && ipAddress) {
      config.headers.DeviceID = deviceID;
      config.headers.DeviceBrand = getBrand();
      config.headers.DeviceName = deviceName;
      config.headers.DeviceModel = Platform.OS;
      config.headers.IPAddress = ipAddress;
    }

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    console.log('Request Interceptor:', config.url);
    console.log('Request Headers:', config.headers);

    return config;
  },
  (err) => Promise.reject(err),
);

type TokenData = {
  accessToken: string;
  refreshToken: string;
};

let isRefreshing = false;
let refreshTokenPromise: Promise<TokenData> | null = null;

baseRequest.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const isFromRefresh = originalRequest.url?.includes(apiUrl('/refresh'));
    if (isFromRefresh) {
      return Promise.reject(error.response?.data || error);
    }
    if (error.response?.status === 401 && !originalRequest._retry && !isFromRefresh) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenPromise = baseRequest({
          url: apiUrl('/refresh'),
          method: 'POST',
          data: {
            refreshToken: storage.getString(REFRESH_TOKEN_STORAGE),
          },
        })
          .then((refreshResponse) => {
            const tokenData = refreshResponse.data.data as TokenData;
            if(tokenData) {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = tokenData;
              storage.set(ACCESS_TOKEN_STORAGE, newAccessToken);
              storage.set(REFRESH_TOKEN_STORAGE, newRefreshToken);

              baseRequest.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
              // Update data if has refreshToken
              return tokenData;
            }
            throw new Error('Failed to refresh token: No data received');
          })
          .catch((refreshError) => {
            throw refreshError;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      originalRequest._retry = true;

      try {
        const tokenData = await refreshTokenPromise!;

        // Update Authorization header if possible
        if (originalRequest.headers?.Authorization !== undefined && tokenData.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${tokenData.accessToken}`;
        }

        if (originalRequest.data && tokenData.refreshToken) {
          if (typeof originalRequest.data === 'string') {
            try {
              const parsed = JSON.parse(originalRequest.data);
              parsed.refreshToken = tokenData.refreshToken;
              originalRequest.data = JSON.stringify(parsed);
            } catch (e) {
              console.error('Could not parse request data', e);
            }
          } else if (typeof originalRequest.data === 'object') {
            originalRequest.data.refreshToken = tokenData.refreshToken;
          }
        }

        console.log('Token refreshed successfully, retrying original request:', originalRequest.url);
        return baseRequest(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        throw refreshError;
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);

// === REQUEST WRAPPER ===
const request = (url?: string, options?: AxiosRequestConfig) => {
  const config: AxiosRequestConfig = {
    url,
    method: options?.method || 'GET',
    ...options,
  };

  const onSuccess = (response: AxiosResponse) => {
    if (response) {return response.data;}
    return response;
  };

  const onError = (error: AxiosError) => {
    return Promise.reject(error.response?.data || error);
  };

  return baseRequest(config).then(onSuccess).catch(onError);
};

export default request;
