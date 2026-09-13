import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * Breakpoint min-widths – must match theme.breakpoints in @components/atoms/theme.
 * Used so this hook has no dependency on theme.
 */
const BREAKPOINTS = { sm: 0, md: 400, lg: 768 } as const;

type Breakpoint = keyof typeof BREAKPOINTS;

const getBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  return 'sm';
};

export interface ScreenSize {
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  breakpoint: Breakpoint;
}

export const useScreenSize = (): ScreenSize => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const breakpoint = getBreakpoint(width);
    return {
      isSmall: breakpoint === 'sm',
      isMedium: breakpoint === 'md',
      isLarge: breakpoint === 'lg',
      breakpoint,
    };
  }, [width]);
};

export default useScreenSize;
