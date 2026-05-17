import type { HybridView, HybridViewProps } from 'react-native-nitro-modules'

/**
 * Props for the native shimmer view.
 * After editing, run: npx nitrogen
 */
export interface ShimmerViewProps extends HybridViewProps {
  /** Animation cycle duration in milliseconds. Default 1800. */
  duration: number

  /** Corner radius in points. Default 0. */
  borderRadius: number

  /**
   * Background (base) color as a hex string, e.g. "#E0E0E0".
   * Matches theme.pallate.neutral['03'] by default.
   */
  shimmerColor: string

  /**
   * Peak highlight opacity (0–1). Controls how bright the sweep is.
   * Default 0.7.
   */
  highlightOpacity: number
}

export type ShimmerView = HybridView<ShimmerViewProps>
