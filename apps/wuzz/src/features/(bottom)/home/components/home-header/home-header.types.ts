import type { SharedValue } from 'react-native-reanimated';

export type HomeHeaderProps = {
  topInset: number;
  isAuthenticated: boolean;
  onLoginPress: () => void;
  /** Coverage area under "Your Current Location", e.g. "Jakarta Barat". */
  locationLabel: string;
  /** The signed-in customer's points. The button is left out until it is known. */
  points?: number;
  /** True while the header should be tucked away above the screen (scrolling down). */
  hidden?: SharedValue<boolean>;
};
