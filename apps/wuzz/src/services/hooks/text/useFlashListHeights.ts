import { useMemo } from 'react'
import { prepare } from '../../../core/text/prepare'
import { layout } from '../../../core/text/layout'
import type { TextWeight } from '../../../components/atoms/text/text.types'

/**
 * Pre-warm heights for every item in a FlashList dataset.
 * Returns a Map<index, pixelHeight> you can pass to FlashList's
 * `overrideItemLayout` for zero-jump virtualization.
 *
 * @param baseItemHeight  Fixed non-text height per cell (padding, avatar, etc.)
 */
export function useFlashListHeights<T>(
  data: T[],
  getText: (item: T) => string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  maxWidth: number,
  baseItemHeight = 0,
  italic = false,
  fontFamily?: string,
): Map<number, number> {
  return useMemo(() => {
    const map = new Map<number, number>()
    if (maxWidth <= 0) return map

    for (let i = 0; i < data.length; i++) {
      const text = getText(data[i]!)
      try {
        const { height } = layout(prepare(text, weight, fontSize, italic, fontFamily), maxWidth)
        map.set(i, height + baseItemHeight)
      } catch {
        map.set(i, fontSize * 1.5 + baseItemHeight)
      }
    }

    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, weight, fontSize, maxWidth, baseItemHeight, italic, fontFamily])
}
