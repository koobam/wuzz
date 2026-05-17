import { useMemo } from 'react'
import { prepare, measureNaturalWidth } from '../../../core/text/prepare'
import type { TextMorphData } from '../../../core/text/types'
import type { TextWeight } from '../../../components/atoms/text/text.types'

/**
 * Pre-compute data for an animated text-morph transition (from → to).
 * Pair with Reanimated interpolation for smooth glyph-level transitions.
 */
export function useTextMorphing(
  fromText: string,
  toText: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  italic = false,
  fontFamily?: string,
): TextMorphData {
  return useMemo(() => {
    const fromPrepared = prepare(fromText, weight, fontSize, italic, fontFamily)
    const toPrepared   = prepare(toText,   weight, fontSize, italic, fontFamily)

    // Longest common prefix
    const minLen = Math.min(fromText.length, toText.length)
    let prefixLen = 0
    while (prefixLen < minLen && fromText[prefixLen] === toText[prefixLen]) prefixLen++

    const commonPrefix = fromText.slice(0, prefixLen)
    const commonPrefixWidth =
      prefixLen > 0 ? measureNaturalWidth(commonPrefix, weight, fontSize, italic, fontFamily) : 0

    return {
      fromSegments: fromPrepared.segments,
      toSegments: toPrepared.segments,
      commonPrefix,
      commonPrefixWidth,
    }
  }, [fromText, toText, weight, fontSize, italic, fontFamily])
}
