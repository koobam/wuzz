import { Text, theme, VStack } from '@components/atoms';
import { Location } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MAP_DELTA = 0.008;

export interface OrderMapBandProps {
  height: number;
  /** Where to centre the map: the pickup address or the outlet. Null shows the
   *  plain band instead, not a map of somewhere else. */
  place: { lat: number; lng: number } | null;
  /** What the plain band says when there is no place yet. */
  emptyLabel: string;
}

/**
 * The band across the top of the checkout: a map of where the order changes
 * hands, with the back pill floating over it.
 */
export const OrderMapBand = memo(function OrderMapBand({
  height,
  place,
  emptyLabel,
}: OrderMapBandProps) {
  if (!place) {
    return (
      <VStack
        height={height}
        items="center"
        justify="center"
        gap={theme.spacing.small}
        backgroundColor={theme.pallate.neutral['02']}
      >
        <Location
          size={28}
          variant="Bulk"
          color={theme.pallate.neutral['04']}
        />
        <Text type="l1" color={theme.pallate.neutral['04']}>
          {emptyLabel}
        </Text>
      </VStack>
    );
  }

  const coordinate = { latitude: place.lat, longitude: place.lng };
  return (
    <VStack height={height} backgroundColor={theme.pallate.neutral['02']}>
      <MapView
        key={`${coordinate.latitude},${coordinate.longitude}`}
        style={styles.map}
        initialRegion={{
          ...coordinate,
          latitudeDelta: MAP_DELTA,
          longitudeDelta: MAP_DELTA,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        toolbarEnabled={false}
      >
        <Marker coordinate={coordinate} />
      </MapView>
    </VStack>
  );
});

const styles = StyleSheet.create({
  map: { flex: 1 },
});
