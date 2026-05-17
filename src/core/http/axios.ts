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
    if (!error.config) return Promise.reject(error);

    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const isFromRefresh = originalRequest.url?.includes(apiUrl('/refresh'));

    if (isFromRefresh) return Promise.reject(error.response?.data || error);

    if (error.response?.status === 401 && !originalRequest._retry && !isFromRefresh) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenPromise = baseRequest({
          url: apiUrl('/refresh'),
          method: 'POST',
          data: { refreshToken: storage.getString(REFRESH_TOKEN_STORAGE) },
        })
          .then((res) => {
            const tokenData = res.data.data as TokenData;
            if (!tokenData) throw new Error('Failed to refresh token: No data received');
            storage.set(ACCESS_TOKEN_STORAGE, tokenData.accessToken);
            storage.set(REFRESH_TOKEN_STORAGE, tokenData.refreshToken);
            baseRequest.defaults.headers.Authorization = `Bearer ${tokenData.accessToken}`;
            return tokenData;
          })
          .finally(() => { isRefreshing = false; });
      }

      originalRequest._retry = true;

      const tokenData = await refreshTokenPromise!;

      if (originalRequest.headers?.Authorization !== undefined) {
        originalRequest.headers.Authorization = `Bearer ${tokenData.accessToken}`;
      }

      return baseRequest(originalRequest);
    }

    return Promise.reject(error.response?.data || error);
  },
);

const axiosRequest = (url?: string, options?: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse) => response?.data ?? response;
  const onError = (error: AxiosError) => Promise.reject(error.response?.data || error);
  return baseRequest({ url, method: 'GET', ...options }).then(onSuccess).catch(onError);
};

export default axiosRequest;
