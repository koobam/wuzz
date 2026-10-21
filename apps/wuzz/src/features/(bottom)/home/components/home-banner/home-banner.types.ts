import type { SharedValue } from 'react-native-reanimated';

export type HomeBannerProps = {
  screenWidth: number;
  /** Page scroll offset, for the stretchy over-scroll effect. Optional — the
   *  banner just keeps its fixed height if the screen doesn't pass one. */
  scrollY?: SharedValue<number>;
};
