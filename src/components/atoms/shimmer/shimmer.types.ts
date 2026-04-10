import type { StyleProp, ViewStyle } from 'react-native';

export type ShimmerProps = {
  /** Width of the skeleton (number or '100%'). */
  width?: number | string;
  /** Height of the skeleton. */
  height?: number | string;
  /** Border radius. */
  borderRadius?: number;
  /** Additional style. */
  style?: StyleProp<ViewStyle>;
};
