import React, { memo } from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '@components/atoms';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PaginatorDotProps {
  index: number;
  scrollX: SharedValue<number>;
}

export const PaginatorDot = memo(
  ({ index: dotIndex, scrollX: scrollXValue }: PaginatorDotProps) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      const inputRange = [
        (dotIndex - 1) * SCREEN_WIDTH,
        dotIndex * SCREEN_WIDTH,
        (dotIndex + 1) * SCREEN_WIDTH,
      ];

      const width = interpolate(
        scrollXValue.value,
        inputRange,
        [8, 24, 8],
        Extrapolation.CLAMP,
      );

      const opacity = interpolate(
        scrollXValue.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolation.CLAMP,
      );

      return {
        width,
        opacity,
      };
    });

    return <Animated.View style={[styles.dot, animatedDotStyle]} />;
  },
);

PaginatorDot.displayName = 'PaginatorDot';

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.pallate.neutral['01'],
  },
});

