import React, { memo } from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '@components/atoms';
import type { PaginatorDotProps } from './paginator-dot.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  paginatorDot: {
    height: 8,
    borderRadius: 4,
    borderCurve: 'continuous',
    backgroundColor: theme.pallate.primary['03'],
  },
});

export const PaginatorDot = memo(
  ({ index: dotIndex, scrollX: scrollXValue }: PaginatorDotProps) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (dotIndex - 1) * SCREEN_WIDTH,
        dotIndex * SCREEN_WIDTH,
        (dotIndex + 1) * SCREEN_WIDTH,
      ];

      const width = interpolate(scrollXValue.value, inputRange, [8, 24, 8]);
      const opacity = interpolate(
        scrollXValue.value,
        inputRange,
        [0.3, 1, 0.3],
      );

      return { width, opacity };
    });

    return <Animated.View style={[styles.paginatorDot, animatedStyle]} />;
  },
);

PaginatorDot.displayName = 'PaginatorDot';
