import { Box, theme } from '@components/atoms';
import Image from '@components/atoms/image';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import type { OutletMapMarkerProps } from './outlet-map-marker.types';

const styles = StyleSheet.create({
  imageWrapper: {
    width: 55,
    height: 55,
    overflow: 'hidden',
    borderRadius: 14,
    borderWidth: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export const OutletMapMarker = memo(({ marker }: OutletMapMarkerProps) => (
    <Svg width={55} height={55} viewBox="0 0 55 55">
      <Box margin={{ marginTop: -8 }} style={styles.imageWrapper}>
        <Image
          uri={marker.imageUri}
          resizeMode="cover"
          style={styles.image}
        />
      </Box>
      <Polygon
        points="20,44 35,44 27.5,54"
        fill={theme.pallate.neutral['05']}
      />
    </Svg>
));

OutletMapMarker.displayName = 'OutletMapMarker';
