import qs, {StringifiableRecord} from 'query-string';
import Config from 'react-native-config';

type UrlBuilder = (path: string, query?: StringifiableRecord) => string;

const getBaseUrl = (): string => {
  const base = (Config as {API_GATEWAY_URL?: string}).API_GATEWAY_URL;
  if (base == null || base === '') {
    throw new Error(
      'Missing API base URL: set API_GATEWAY_URL in your .env file (e.g. .env.staging).',
    );
  }
  return base.replace(/\/$/, '');
};

/** Version prefix of the customer-app API. Every app endpoint is built from this. */
export const API_V1 = '/app/v1';

/**
 * Builds full URL for API gateway: base + path + query.
 * Path should start with `/` (e.g. `/login`, `/laundry-services`).
 */
export const apiUrl: UrlBuilder = (path, query) => {
  const base = getBaseUrl();
  const pathNormalized = path.startsWith('/') ? path : `/${path}`;
  return qs.stringifyUrl({
    url: new URL(pathNormalized, base).toString(),
    query,
  });
};

export default apiUrl;
