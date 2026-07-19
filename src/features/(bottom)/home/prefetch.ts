import { appStartPrefetchUrls } from '@services/hooks/utils/usePrefetch';
import { LAUNDRY_SERVICES_QUERY_KEY } from '@services/queries/laundry-services.queries';

export async function prefetchHomeData(): Promise<void> {
  try {
    await appStartPrefetchUrls([
      { path: '/services?service_category=regular', prefetchKey: LAUNDRY_SERVICES_QUERY_KEY.regular },
      { path: '/services?service_category=alacarte', prefetchKey: LAUNDRY_SERVICES_QUERY_KEY.alacarte },
    ]);
  } catch (error) {
    // TODO: Sentry.captureException(error)
    console.error('[prefetchHomeData]', error);
  }
}
