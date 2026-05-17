import { Box, HStack, Text, theme, VStack } from '@components/atoms';
import Image from '@components/atoms/image';
import { Star1 } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import type { OutletMapMarkerProps } from './outlet-map-marker.types';

const styles = StyleSheet.create({
  imageWrapper: {
    width: 55,
    height: 55,
    overflow: 'hidden',
    borderRadius: 30,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export const OutletMapMarker = memo(({ marker }: OutletMapMarkerProps) => (
  <VStack items="center">
    <HStack
      backgroundColor={theme.pallate.neutral['05']}
      padding={{
        paddingVertical: theme.spacing.small + 1,
        paddingHorizontal: theme.spacing.standard,
      }}
      gap={2}
      zIndex={1}
      borderRadius={999}
    >
      <Star1 variant="Bold" size={16} color="yellow" />
      <Text type="l1" weight="bold" color={theme.pallate.neutral['01']}>
        {marker.rating.toFixed(1)}
      </Text>
    </HStack>
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
  </VStack>
));

OutletMapMarker.displayName = 'OutletMapMarker';
