import type { SharedValue } from 'react-native-reanimated';
import { useAnimatedStyle } from 'react-native-reanimated';

export interface UseStretchyBannerStyleParams {
  /** Vertical offset of the page scroll view, tracked on the UI thread. */
  scrollY: SharedValue<number>;
  /** Base height of the banner. */
  height: number;
}

/**
 * Banner meregang mengikuti over-scroll ke atas (efek stretchy).
 *
 * Over-scroll makes contentOffset.y negative and pushes the content down by
 * that amount, which would leave a blank strip above the banner. The banner
 * grows upward by the same amount to fill it.
 *
 * A transform, not `height`: this banner is a horizontal FlashList, and a
 * height that changes every frame makes Yoga re-lay-out the list and each of
 * its cells sixty times a second. A virtualised list responds to that by
 * blanking and re-measuring cells, which is the flicker and the paging that
 * loses its place. A transform is composited: the list's box never moves, so
 * it never notices the animation at all.
 *
 * Uniform scale, not scaleY: stretching one axis makes the photograph and its
 * lettering visibly gaunt, while scaling both reads as the image zooming in —
 * the extra width simply runs off the screen edges, which is what the eye
 * expects from a full-bleed banner.
 *
 * The scale is around a fixed bottom edge: scaling from the centre would push
 * the bottom down over the outlet card, so the extra `translateY` of -bounce/2
 * pins the bottom and sends all the growth upward, into the gap.
 */
export function useStretchyBannerStyle({
  scrollY,
  height,
}: UseStretchyBannerStyleParams) {
  return useAnimatedStyle(() => {
    // Only over-scroll stretches. Scrolling the page down normally must leave
    // the banner alone, or it would shrink out from under the content.
    const bounce = scrollY.value < 0 ? -scrollY.value : 0;
    return {
      transform: [
        { translateY: -bounce / 2 },
        { scale: (height + bounce) / height },
      ],
    };
  });
}
