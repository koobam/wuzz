import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { IS_IOS } from '../../../../env';

/**
 * Frosted glass for controls that sit over a photo.
 *
 * Give the control `glassSurface` (hairline edge, faint tint, clipping) and put
 * `<GlassBlur />` as its first child. The blur is iOS-only; Android keeps the tint
 * on its own, so the control is still readable there.
 *
 * A blur only shows what is behind it. Once the page scrolls the control onto
 * plain white there is nothing to blur, so the edge is a faint dark hairline
 * (a white one would vanish on white) and the tint is strong enough to hold the
 * shape on its own. Over the photo it still reads as frosted glass.
 */
export const GLASS_BORDER = 'rgba(0,0,0,0.08)';
export const GLASS_TINT = 'rgba(255,255,255,0.5)';
const GLASS_BLUR_AMOUNT = 16;

export const glassSurface = StyleSheet.create({
  surface: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_TINT,
    borderCurve: 'continuous',
  },
}).surface;

export const GlassBlur = memo(() =>
  IS_IOS ? (
    <BlurView
      pointerEvents="none"
      blurType="light"
      blurAmount={GLASS_BLUR_AMOUNT}
      style={StyleSheet.absoluteFill}
    />
  ) : null,
);
GlassBlur.displayName = 'GlassBlur';
