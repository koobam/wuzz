import {ViewStyle} from 'react-native';
import React from 'react';
import theme from '../theme';

/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
export function getValidChildren(
  children: React.ReactNode | React.ReactNode[],
) {
  return React.Children.toArray(children).filter(child =>
    React.isValidElement(child),
  ) as React.ReactElement[];
}

export interface PaddingType {
  paddingTop?: number;
  paddingBottom?: number;
  paddingRight?: number;
  paddingLeft?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

export interface PositionType {
  bottom?: number;
  top?: number;
  right?: number;
  left?: number;
  set?: ViewStyle['position'];
}

export interface MarginType {
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
  marginHorizontal?: number;
  marginVertical?: number;
}

export interface BorderWidthType {
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
}

export interface BorderRadiusType {
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
}
export interface BorderColorType {
  borderTopColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRightColor?: string;
}

export const createPaddingStyle = (padding: PaddingType | number) => {
  if (typeof padding === 'number') {
    return {padding};
  }

  const {
    paddingTop,
    paddingBottom,
    paddingRight,
    paddingLeft,
    paddingHorizontal,
    paddingVertical,
  } = padding;

  return {
    paddingTop,
    paddingBottom,
    paddingRight,
    paddingLeft,
    paddingHorizontal,
    paddingVertical,
  };
};

export const createMarginStyle = (margin: MarginType | number) => {
  if (typeof margin === 'number') {
    return {margin};
  }

  const {
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    marginHorizontal,
    marginVertical,
  } = margin;

  return {
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    marginHorizontal,
    marginVertical,
  };
};

export const createPositionStyle = (position: PositionType | string) => {
  if (typeof position === 'string') {
    return {position};
  }

  const {top, bottom, set, right, left} = position;
  return {
    position: set || 'absolute',
    top,
    bottom,
    right,
    left,
  };
};

export const createBorderColorStyle = (
  borderColor: BorderColorType | string,
) => {
  if (typeof borderColor === 'string') {
    return {borderColor};
  }
  const {borderTopColor, borderBottomColor, borderLeftColor, borderRightColor} =
    borderColor;

  return {
    borderTopColor,
    borderBottomColor,
    borderLeftColor,
    borderRightColor,
  };
};

export const createBorderWidthStyle = (
  borderWidth: BorderWidthType | number,
) => {
  if (typeof borderWidth === 'number') {
    return {borderWidth};
  }
  const {borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth} =
    borderWidth;

  return {
    borderTopWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderRightWidth,
  };
};

export const createBorderRadiusStyle = (
  borderRadius: BorderRadiusType | number,
) => {
  if (typeof borderRadius === 'number') {
    return {borderRadius};
  }
  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  } = borderRadius;

  return {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  };
};

export const getAbsoluteChildren = (
  children: React.ReactNode,
  reverse?: boolean,
) => {
  let childrenArray = React.Children.toArray(children).filter(Boolean); // Filter out undefined elements
  if (reverse) {
    childrenArray = childrenArray.reverse();
  }

  /*
    | Add the position to the children
    */
  const trailingChildrenWithSpacing = childrenArray.map((child: any) => {
    // Use React.ReactElement<any>
    return React.cloneElement(
      child,
      {position: 'absolute'},
      child.props.children,
    );
  });

  /*
    | New children array with applied margin to trailing children
    */
  return trailingChildrenWithSpacing;
};

export const getBreakpointForScreenSize = (dimensions: number): string | null => {
  const sortedBreakpoints = Object.entries(theme.breakpoints).sort(
    (valA, valB) => {
      return valA[1] - valB[1];
    }
  );

  return sortedBreakpoints.reduce<string | null>((acc, [breakpoint, minWidth]) => {
    if (dimensions >= minWidth) {return breakpoint;}
    return acc;
  }, null);
};


export const getResponsiveValue = (value: any, dimensions: number) => {
  if (typeof value === 'object') {
    const breakpoint = getBreakpointForScreenSize(dimensions);
    if (breakpoint !== null && breakpoint in value) {
      return value[breakpoint];
    }
  }
  return value;
};


export type ResponsiveValue<T> = T | Record<keyof typeof theme.breakpoints, T>;
