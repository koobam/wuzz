import type { Coordinates } from '@hooks/utils/useCurrentLocation';

/** A driver or technician who comes to the customer's door. */
export type Wuzzer = {
  id: string;
  name: string;
  /** Profile photo, shown on the card and inside the map pin. */
  photoUri: string;
  /** Average rating, shown on the pin and the card when there is one. */
  rating?: number;
  /** Straight-line distance from the customer, in km. */
  distanceKm: number;
  /** Where to put the pin. Approximate on purpose; never the exact live position. */
  coords?: Coordinates;
};

export type WuzzerNearbyProps = {
  /** The device position; null until it is known (or when it cannot be). */
  coords: Coordinates | null;
  /** The position is still being fetched. */
  isLocating: boolean;
  /** Location permission is denied, so the way out is the system settings. */
  isLocationError: boolean;
  /** Wuzzers close enough to call. Empty until there is data behind it. */
  wuzzers?: Wuzzer[];
  /** Call a Wuzzer. */
  onCall?: (wuzzer: Wuzzer) => void;
  /** "Lihat Semua Wuzzer" at the end of the list. There is no list screen yet. */
  onSeeAll?: () => void;
};
