import type { OutletMapMarker as OutletMapMarkerType } from '../../types';

export type OutletMapMarkerProps = {
  marker: OutletMapMarkerType;
  /** Marker outlet yang sedang terpilih → border & pin beda warna. */
  isSelected?: boolean;
};
