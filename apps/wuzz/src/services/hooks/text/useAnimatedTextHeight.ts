import { useEffect } from 'react'
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated'
import { prepare } from '../../../core/text/prepare'
import { layout } from '../../../core/text/layout'
import type { TextWeight } from '../../../components/atoms/text/text.types'

/**
 * Returns a Reanimated SharedValue that animates to the measured text height
 * whenever text / maxWidth / style changes.
 */
export function useAnimatedTextHeight(
  text: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  maxWidth: number,
  italic = false,
  fontFamily?: string,
  durationMs = 200,
) {
  const animatedHeight = useSharedValue(0)

  useEffect(() => {
    if (!text || maxWidth <= 0) {
      animatedHeight.value = withTiming(0, { duration: durationMs, easing: Easing.out(Easing.quad) })
      return
    }
    try {
      const { height } = layout(prepare(text, weight, fontSize, italic, fontFamily), maxWidth)
      animatedHeight.value = withTiming(height, { duration: durationMs, easing: Easing.out(Easing.quad) })
    } catch {
      animatedHeight.value = withTiming(fontSize * 1.5, { duration: durationMs, easing: Easing.out(Easing.quad) })
    }
  }, [text, weight, fontSize, maxWidth, italic, fontFamily, durationMs])

  return animatedHeight
}
