import type { OutletsParams } from '@api/outlets.types';
import { useFetchOutlets } from '@hooks/apis/outlets';
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
  refetch: () => void;
};

const DEFAULT_CENTER: OutletsParams = {
  lat: -6.13572,
  long: 106.501244,
};

export const useOutletListData = (params?: OutletsParams | null): OutletListData => {
  const queryParams = params ?? DEFAULT_CENTER;
  const { data, isLoading, isError, refetch } = useFetchOutlets(queryParams);

  const outletList = useMemo(() => {
    if (!data?.outlets?.length) return [];
    return data.outlets.map(mapOutletApiToListItem);
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
    refetch,
  };
};
