import React, { ReactNode, memo, useMemo } from 'react';
import { StyleProp, StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Animated, { AnimatedStyle, Easing } from 'react-native-reanimated';
import { EasingGradient } from '@components/atoms/easing-gradient';
import { IS_IOS } from '../../../../env';

type FadeTo = 'top' | 'bottom' | 'left' | 'right';
type GradientPoints = [
  from: { x: number; y: number },
  to: { x: number; y: number },
];
type ValueByTheme<T> = { dark: T; light: T };

type BlurGradientParams = {
  /**
   * A component to render in place of the `BlurView` on Android.
   *
   * Note that if a non-transparent `color` is provided, by default a gradient
   * overlay will be visible on both platforms regardless of the value provided here.
   *
   * @default null
   */
  androidBlurFallback?: ReactNode;
  color?: string | ValueByTheme<string>;
  feather?: number;
  /**
   * The amount of buffer space between the start of the blur and the start of the
   * gradient overlay. Has no effect if `color` is `transparent`.
   *
   * @default 0
   */
  gradientBuffer?: number;
  gradientOpacity?: number | ValueByTheme<number>;
  height: number;
  intensity?: number;
  style?: StyleProp<ViewStyle> | AnimatedStyle<ViewStyle>;
  width: number;
} & (
  | { fadeTo?: FadeTo; gradientPoints?: never }
  | { fadeTo?: never; gradientPoints?: GradientPoints }
);

export const BlurGradient = memo(function BlurGradient({
  androidBlurFallback = null,
  color = 'transparent',
  fadeTo = 'top',
  gradientBuffer = 0,
  gradientOpacity = IS_IOS
    ? { dark: 0.96, light: 0.92 }
    : { dark: 1, light: 1 },
  gradientPoints: gradientPointsProp,
  height,
  intensity = 8,
  style,
  width,
}: BlurGradientParams) {

  const isDarkMode = useColorScheme() === 'dark';

  // Fix the gradient direction and ensure start/end positions and colors are correct
  const { darkAlpha, darkColor, gradientPoints, lightAlpha, lightColor } = useMemo(() => {
    // Ensure color and alpha objects for both light/dark
    const { dark: _darkColor, light: _lightColor } =
      typeof color === 'object' ? color : { dark: color, light: color };
    const { dark: _darkAlpha, light: _lightAlpha } =
      typeof gradientOpacity === 'object'
        ? gradientOpacity
        : { dark: gradientOpacity, light: gradientOpacity };
    
    // Use provided gradient points, or calculate from fadeTo
    let points = gradientPointsProp ?? getGradientPoints(fadeTo);
    // If points are reversed, swap so start and end are correct in the direction
    if (
      fadeTo === 'top' || fadeTo === 'left'
    ) {
      // Invert: make first point the end, second point the start, for proper fade direction
      points = [points[1], points[0]];
    }
    return {
      darkAlpha: typeof _darkAlpha === 'number' ? _darkAlpha : 1,
      lightAlpha: typeof _lightAlpha === 'number' ? _lightAlpha : 1,
      darkColor: _darkColor,
      lightColor: _lightColor,
      gradientPoints: points,
    };
  }, [color, fadeTo, gradientOpacity, gradientPointsProp]);

  return (
    <Animated.View style={[styles.blurHeaderWrapper, style, { height, width }]}>
      {IS_IOS ? (
        <BlurView
          blurRadius={1}
          blurAmount={10}
          blurType="dark"
          reducedTransparencyFallbackColor={isDarkMode ? darkColor : lightColor}
          style={{ height, width }}
        />
      ) : (
        androidBlurFallback
      )}

      {color === 'transparent' ? null : (
        <EasingGradient
          easing={Easing.inOut(Easing.quad)}
          endColor={isDarkMode ? darkColor : lightColor}
          endOpacity={0}
          endPosition={{ x: gradientPoints[0].x, y: gradientPoints[0].y }}
          startColor={isDarkMode ? darkColor : lightColor}
          startOpacity={isDarkMode ? darkAlpha : lightAlpha}
          startPosition={{ x: gradientPoints[1].x, y: gradientPoints[1].y }}
          steps={Math.min(
            Math.floor(
              (fadeTo === 'top' || fadeTo === 'bottom' ? height : width) / 5.35,
            ),
            32,
          )}
          style={[
            styles.blurHeaderContent,
            {
              [getGradientBufferPosition(fadeTo)]: gradientBuffer,
              height: height - gradientBuffer,
              width,
            },
          ]}
        />
      )}
    </Animated.View>
  );
});

function getGradientBufferPosition(
  fadeTo: FadeTo,
): 'bottom' | 'left' | 'right' | 'top' {
  switch (fadeTo) {
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    case 'top':
    default:
      return 'bottom';
  }
}

function getGradientPoints(fadeTo: FadeTo): GradientPoints {
  switch (fadeTo) {
    case 'bottom':
      return [
        { x: 0.5, y: 0 },
        { x: 0.5, y: 1 },
      ];
    case 'left':
      return [
        { x: 0, y: 0.5 },
        { x: 1, y: 0.5 },
      ];
    case 'right':
      return [
        { x: 1, y: 0.5 },
        { x: 0, y: 0.5 },
      ];
    case 'top':
    default:
      return [
        { x: 0.5, y: 1 },
        { x: 0.5, y: 0 },
      ];
  }
}

const styles = StyleSheet.create({
  blurHeaderContent: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  blurHeaderWrapper: {
    pointerEvents: 'none',
    position: 'relative',
  },
});
