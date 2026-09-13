import { useMemo } from 'react'
import { prepare } from '../../../core/text/prepare'
import { layout } from '../../../core/text/layout'
import type { TextWeight } from '../../../components/atoms/text/text.types'

/**
 * Pre-measure text height before rendering.
 * Ideal for FlashList item height estimation.
 */
export function useTextHeight(
  text: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  maxWidth: number,
  italic = false,
  fontFamily?: string,
): number {
  return useMemo(() => {
    if (!text || maxWidth <= 0) return 0
    try {
      return layout(prepare(text, weight, fontSize, italic, fontFamily), maxWidth).height
    } catch {
      return fontSize * 1.5
    }
  }, [text, weight, fontSize, maxWidth, italic, fontFamily])
}
