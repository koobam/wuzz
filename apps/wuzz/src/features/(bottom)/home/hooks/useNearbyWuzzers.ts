import { useMemo } from 'react';
import type { Coordinates } from '@hooks/utils/useCurrentLocation';
import type { Wuzzer } from '../components/wuzzer-nearby/wuzzer-nearby.types';
import { dummyWuzzersNear } from '../mocks/wuzzers';

/**
 * Wuzzers close to `coords`, nearest first. There is no Wuzzer backend yet, so
 * development builds get the dummy list and a release build gets nothing: the
 * screens then show their empty state instead of made-up people. Replace the body
 * with the real query when it exists; both Home and the full list read from here.
 */
export const useNearbyWuzzers = (
  coords: Coordinates | null | undefined,
): Wuzzer[] | undefined =>
  useMemo(
    () => (__DEV__ && coords != null ? dummyWuzzersNear(coords) : undefined),
    [coords],
  );
