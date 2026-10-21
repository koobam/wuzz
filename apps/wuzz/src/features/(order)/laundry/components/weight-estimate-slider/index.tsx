import { HStack, Text, theme, VStack } from '@components/atoms';
import { WeightMeter } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useWeightEstimateSlider } from '../../hooks';
import {
  MIN_KG,
  MAX_KG,
  PIECES_PER_KG_MAX,
  PIECES_PER_KG_MIN,
  THUMB_SIZE,
  TRACK_HEIGHT,
  TOOLTIP_WIDTH,
} from '../../utils';
import type { WeightEstimateSliderProps } from './weight-estimate-slider.types';

const styles = StyleSheet.create({
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderCurve: 'continuous',
    backgroundColor: theme.pallate.neutral['03'],
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderCurve: 'continuous',
    backgroundColor: theme.pallate.primary['03'],
  },
  thumb: {
    position: 'absolute',
    left: 0,
    top: -(THUMB_SIZE - TRACK_HEIGHT) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: theme.pallate.neutral['01'],
    backgroundColor: theme.pallate.primary['03'],
  },
  tooltipBubble: {
    width: TOOLTIP_WIDTH,
    paddingVertical: theme.spacing.tiny,
    borderRadius: 999,
    borderCurve: 'continuous',
    backgroundColor: theme.pallate.neutral['03'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderWrap: {
    flex: 1,
    width: '100%',
    gap: theme.spacing.tiny,
    justifyContent: 'flex-end',
  },
  tooltipRow: {
    height: 28,
    marginBottom: 4,
  },
  tooltipAbsolute: {
    position: 'absolute',
    left: 0,
  },
});

export const WeightEstimateSlider = memo(function WeightEstimateSlider({
  minKg,
  maxKg,
  initialKg = 3,
  onChange,
}: WeightEstimateSliderProps) {
  const {
    valueKg,
    handleLayout,
    panGesture,
    trackFillStyle,
    thumbStyle,
    tooltipStyle,
  } = useWeightEstimateSlider({
    minKg: minKg ?? MIN_KG,
    maxKg: maxKg ?? MAX_KG,
    initialKg,
    onChange,
  });

  const minKgDisplay = minKg ?? MIN_KG;
  const maxKgDisplay = maxKg ?? MAX_KG;

  return (
    <VStack
      padding={{ paddingHorizontal: theme.spacing.large }}
      gap={theme.spacing.medium}
    >
      <HStack items="center" gap={theme.spacing.small}>
        <WeightMeter
          size={28}
          color={theme.pallate.neutral['05']}
          variant="Linear"
        />
        <VStack fill>
          <Text type="s3" weight="semibold" color={theme.pallate.neutral['05']}>
            Perkiraan Berat
          </Text>
          <Text type="l2" color={theme.pallate.neutral['04']}>
            Tentukan estimasi berat cucian untuk mengetahui harga.
          </Text>
        </VStack>
        {/* How many garments that weight is, following the slider. */}
        <VStack items="flex-end">
          <Text type="l2" color={theme.pallate.neutral['04']}>
            Perkiraan
          </Text>
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
            {`${valueKg * PIECES_PER_KG_MIN}–${
              valueKg * PIECES_PER_KG_MAX
            } potong baju`}
          </Text>
        </VStack>
      </HStack>

      <HStack items="flex-end" gap={theme.spacing.medium}>
        <VStack items="center">
          <Text type="b1" weight="semibold" color={theme.pallate.neutral['05']}>
            {minKgDisplay}kg
          </Text>
          <Text type="l2" color={theme.pallate.neutral['04']}>
            Minimum
          </Text>
        </VStack>

        <View style={styles.sliderWrap} onLayout={handleLayout}>
          <GestureDetector gesture={panGesture}>
            <VStack gap={theme.spacing.tiny}>
              <View style={styles.tooltipRow}>
                <Animated.View
                  style={[
                    styles.tooltipBubble,
                    styles.tooltipAbsolute,
                    tooltipStyle,
                  ]}
                  pointerEvents="none"
                >
                  <Text
                    type="l1"
                    weight="semibold"
                    color={theme.pallate.neutral['05']}
                  >
                    {valueKg}kg
                  </Text>
                </Animated.View>
              </View>
              <View style={styles.track}>
                <Animated.View style={[styles.trackFill, trackFillStyle]} />
                <Animated.View style={[styles.thumb, thumbStyle]} />
              </View>
            </VStack>
          </GestureDetector>
        </View>

        <VStack items="center">
          <Text type="b1" weight="semibold" color={theme.pallate.neutral['05']}>
            {maxKgDisplay}kg
          </Text>
          <Text type="l2" color={theme.pallate.neutral['04']}>
            Maksimum
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
});

export type { WeightEstimateSliderProps } from './weight-estimate-slider.types';
