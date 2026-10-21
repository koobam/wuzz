import { BoxAnimated, theme } from '@components/atoms';
import { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { MenuCategoryIndicatorProps } from './menu-category-indicator.types';

const INDICATOR_WIDTH = 3;

/** Smooth spring: minimal bounce, no blink. */
const SPRING_CONFIG = { damping: 28, stiffness: 200 };

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    left: 0,
    width: INDICATOR_WIDTH,
    backgroundColor: theme.pallate.primary['03'],
    borderRadius: INDICATOR_WIDTH / 2,
    borderCurve: 'continuous',
  },
});

export const MenuCategoryIndicator = memo((props: MenuCategoryIndicatorProps) => {
  const { top, height } = props;

  const topSv = useSharedValue(top);
  const heightSv = useSharedValue(height);

  useEffect(() => {
    topSv.value = withSpring(top, SPRING_CONFIG);
    heightSv.value = withSpring(height, SPRING_CONFIG);
  }, [top, height, topSv, heightSv]);

  const animatedStyle = useAnimatedStyle(() => ({
    top: topSv.value,
    height: heightSv.value,
  }));

  return (
    <BoxAnimated
      style={[styles.indicator, animatedStyle]}
    />
  );
});

MenuCategoryIndicator.displayName = 'MenuCategoryIndicator';

export type { MenuCategoryIndicatorProps } from './menu-category-indicator.types';
