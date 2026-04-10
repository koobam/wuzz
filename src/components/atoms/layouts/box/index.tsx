import React, { useMemo } from 'react';

import { View, ViewProps, ViewStyle, useWindowDimensions } from 'react-native';

import {
  BorderColorType,
  BorderRadiusType,
  BorderWidthType,
  MarginType,
  PaddingType,
  PositionType,
  createMarginStyle,
  createBorderColorStyle,
  createBorderRadiusStyle,
  createBorderWidthStyle,
  createPaddingStyle,
  createPositionStyle,
  getResponsiveValue,
  ResponsiveValue,
} from '../helper';

import Reanimated from 'react-native-reanimated';

export interface BoxProps extends ViewProps {
  ref?: React.Ref<View>;
  as?: React.ReactElement;
  gap?: number;
  height?: number | string | ResponsiveValue<number | string>;
  width?: number | string | ResponsiveValue<number | string>;
  padding?: PaddingType | number;
  zIndex?: number;
  margin?: MarginType | number;
  position?: PositionType | string;
  backgroundColor?: ViewStyle['backgroundColor'];
  borderWidth?: BorderWidthType | number;
  borderColor?: BorderColorType | string;
  borderRadius?: BorderRadiusType | number;
  opacity?: number;
}

/**
 * Box is component serves as a wrapper component for most of the styling properties.
 * Also, for references check it out {@link https://github.com/yamankatby/react-native-flex-layout/blob/main/src/Box.tsx}
 */
export const Box = React.memo((props: BoxProps) => {
  const {
    as,
    style,
    position,
    width,
    height,
    padding,
    margin,
    borderWidth,
    borderColor,
    borderRadius,
    backgroundColor,
    zIndex,
    ref,
    gap,
    ...rest
  } = props;

  const { width: screenWidth } = useWindowDimensions();

  const resolvedWidth = useMemo(() => {
    if (typeof width === 'object') {
      return getResponsiveValue(width, screenWidth);
    }
    return width;
  }, [width, screenWidth]);

  const resolvedHeight = useMemo(() => {
    if (typeof height === 'object') {
      return getResponsiveValue(height, screenWidth);
    }
    return height;
  }, [height, screenWidth]);

  const boxStyle = useMemo(() => {
    let paddingStyle,
      marginStyle,
      positionStyle,
      borderWidthStyle,
      borderColorStyle,
      borderRadiusStyle;

    if (padding) {
      paddingStyle = createPaddingStyle(padding);
    }

    if (margin) {
      marginStyle = createMarginStyle(margin);
    }

    if (position) {
      positionStyle = createPositionStyle(position);
    }

    if (borderWidth) {
      borderWidthStyle = createBorderWidthStyle(borderWidth);
    }

    if (borderColor) {
      borderColorStyle = createBorderColorStyle(borderColor);
    }

    if (borderRadius) {
      borderRadiusStyle = createBorderRadiusStyle(borderRadius);
    }

    return {
      ...positionStyle,
      ...paddingStyle,
      ...marginStyle,
      ...borderWidthStyle,
      ...borderColorStyle,
      ...borderRadiusStyle,
      zIndex,
      width: resolvedWidth,
      height: resolvedHeight,
      gap,
      backgroundColor,
      borderCurve: borderRadius ? ('continuous' as const) : undefined,
    } as ViewStyle;
  }, [
    resolvedWidth,
    resolvedHeight,
    padding,
    margin,
    position,
    borderWidth,
    borderColor,
    borderRadius,
    zIndex,
    backgroundColor,
    gap,
  ]);

  if (as) {
    // `as` is possibly a React.ReactElement, but its type is unknown.
    // To safely access its props, we need to assert its type.
    if (!React.isValidElement(as)) {
      return null;
    }
    const element = as as React.ReactElement<any>;
    const asProps = (element.props || {}) as any;
    if (typeof asProps.style === 'function') {
      return React.cloneElement(element, {
        ref,
        style: (state: any) => {
          const functionStyleArray = [boxStyle, asProps.style(state)];
          if (style) {
            functionStyleArray.push(style);
          }
          return functionStyleArray;
        },
        ...rest,
      } as any);
    }

    const styleArray: ViewStyle[] = [boxStyle];
    if (style) {
      styleArray.push(style as ViewStyle);
    }
    if (asProps.style) {
      styleArray.push(asProps.style as ViewStyle);
    }

    return React.cloneElement(
      element,
      {
        ref,
        style: styleArray,
        ...rest,
      } as any
    );
  }
  return (
    <View
      ref={ref}
      style={[boxStyle as ViewStyle, style]}
      {...rest}
    />
  );
});

export const BoxAnimated = Reanimated.createAnimatedComponent(Box);
export default Box;
