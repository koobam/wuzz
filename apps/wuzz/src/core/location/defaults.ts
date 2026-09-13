import type { Coordinates } from '@features/(utils)/location-permission/hooks/useGeolocation';

/** Fallback coordinates used when the user skips location permission (Central Jakarta). */
export const DEFAULT_COORDS: Coordinates = { lat: -6.2088, long: 106.8456 } as const;
