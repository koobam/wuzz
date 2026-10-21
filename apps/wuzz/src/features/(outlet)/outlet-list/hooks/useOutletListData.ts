import type { OutletsParams } from '@api/outlets.types';
import { useFetchOutlets } from '@hooks/apis/outlets';
import { useSelectedOutlet } from '@services/contexts';
import { useMemo } from 'react';
import type { OutletListItem } from '../types';
import {
  mapOutletApiToListItem,
  outletListItemToMapMarker,
} from '../utils/mapOutletFromApi';

export type OutletListData = {
  outletList: OutletListItem[];
  mapMarkers: Array<{ id: number; lat: number; lng: number; rating: number; imageUri: string }>;
  mapBounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  nextCursor: string;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

/** Backend page-size cap; every outlet fits in one page until there are more than this. */
const ALL_OUTLETS_PAGE_SIZE = 50;

/** Every outlet, by name — no location needed and nothing is picked for the user. */
export const useOutletListData = (): OutletListData => {
  const { selectedOutlet } = useSelectedOutlet();
  const queryParams: OutletsParams = {
    num: ALL_OUTLETS_PAGE_SIZE,
    selected_outlet_id: selectedOutlet?.id ?? undefined,
  };
  const { data, isLoading, isError, error, refetch } = useFetchOutlets(queryParams);

  const outletList = useMemo(() => {
    return (data?.outlets ?? []).map(mapOutletApiToListItem);
  }, [data?.outlets]);

  const mapMarkers = useMemo(
    () => outletList.map(outletListItemToMapMarker),
    [outletList],
  );

  const mapBounds = useMemo(() => {
    if (outletList.length === 0) {
      return {
        minLat: -6.14,
        maxLat: -6.13,
        minLng: 106.49,
        maxLng: 106.51,
      };
    }
    const lats = outletList.map((o) => o.lat);
    const lngs = outletList.map((o) => o.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [outletList]);

  return {
    outletList,
    mapMarkers,
    mapBounds,
    nextCursor: data?.next ?? '',
    isLoading,
    isError,
    error,
    refetch,
  };
};
