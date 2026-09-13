import { useMemo } from 'react'
import { getInkSafeStyle } from '../../../core/text/ink-safe'
import type { TextStyle } from 'react-native'
import type { TextWeight } from '../../../components/atoms/text/text.types'

/**
 * Returns padding values that prevent italic/bold glyph clipping.
 * Spread onto the wrapping View, not the Text.
 */
export function useInkSafeStyle(
  weight: TextWeight = 'regular',
  fontSize = 16,
  italic = false,
): Partial<TextStyle> {
  return useMemo(
    () => getInkSafeStyle(weight, fontSize, italic),
    [weight, fontSize, italic],
  )
}
