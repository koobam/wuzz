import { theme } from '@components/atoms/theme';
import React, { memo, useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { ShimmerProps } from './shimmer.types';

const SHIMMER_WIDTH = 160;
const DURATION_MS = 1800;

/** Easing untuk gerakan shine yang smooth (ease-in-out). */
const shimmerEasing = Easing.bezier(0.4, 0, 0.2, 1);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: theme.pallate.neutral['03'],
  },
  shine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SHIMMER_WIDTH,
  },
});

/** Gradient dengan banyak stop agar fade in/out halus. */
const SHIMMER_COLORS = [
  'rgba(255, 255, 255, 0)',
  'rgba(255, 255, 255, 0.3)',
  'rgba(255, 255, 255, 0.7)',
  'rgba(255, 255, 255, 0.3)',
  'rgba(255, 255, 255, 0)',
];
const SHIMMER_LOCATIONS = [0, 0.2, 0.4, 0.6, 0.8];

export const Shimmer = memo(function Shimmer({
  width = '100%',
  height = 24,
  borderRadius = 0,
  style,
}: ShimmerProps) {
  const translateX = useSharedValue(-SHIMMER_WIDTH);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(420, {
        duration: DURATION_MS,
        easing: shimmerEasing,
      }),
      -1,
      true,
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const containerStyle: ViewStyle[] = [
    styles.container,
    {
      width,
      height,
      borderRadius,
    } as ViewStyle,
    style as ViewStyle,
  ].filter(Boolean);

  return (
    <View style={containerStyle}>
      <Animated.View style={[styles.shine, animatedStyle]}>
        <LinearGradient
          colors={SHIMMER_COLORS}
          locations={SHIMMER_LOCATIONS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
});

export type { ShimmerProps } from './shimmer.types';
