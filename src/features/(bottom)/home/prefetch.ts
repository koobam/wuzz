import { LAUNDRY_SERVICES_ENDPOINTS } from '@api/laundry-services';
import { appStartPrefetchUrls } from '@services/hooks/utils/usePrefetch';
import { LAUNDRY_SERVICES_QUERY_KEY } from '@services/queries/laundry-services.queries';

export async function prefetchHomeData(): Promise<void> {
  try {
    await appStartPrefetchUrls([
      { path: LAUNDRY_SERVICES_ENDPOINTS.regular, prefetchKey: LAUNDRY_SERVICES_QUERY_KEY.regular },
      { path: LAUNDRY_SERVICES_ENDPOINTS.alacarte, prefetchKey: LAUNDRY_SERVICES_QUERY_KEY.alacarte },
    ]);
  } catch (error) { 
    // TODO: Sentry.captureException(error)
    console.error('[prefetchHomeData]', error);
  }
}
