import type { ViewStyle } from 'react-native';
import type { OutletService } from '../../types';

export type OutletServiceBadgeProps = {
  services: OutletService[];
  isSelected?: boolean;
  /** When true, only icons are shown (no label text). */
  iconOnly?: boolean;
  style?: ViewStyle;
  /** Override background color when selected. */
  selectedBackgroundColor?: string;
  /** Override icon/text color when selected. */
  selectedContentColor?: string;
};
