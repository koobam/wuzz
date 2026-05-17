import { getTextMeasurer } from './native-module'
import { resolveFont } from './font-resolver'
import type { PreparedText, SegmentResult } from './types'
import type { TextWeight } from '../../components/atoms/text/text.types'

// ── Helpers ───────────────────────────────────────────────────────────────

function parseRaw(text: string, raw: number[]): SegmentResult[] {
  const out: SegmentResult[] = []
  for (let i = 0; i < raw.length; i += 3) {
    out.push({
      startIndex: raw[i]!,
      endIndex: raw[i + 1]!,
      width: raw[i + 2]!,
      text: text.slice(raw[i], raw[i + 1]),
    })
  }
  return out
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Segment + measure text via the Nitro JSI module.
 * Returns an opaque PreparedText handle; pass it to layout() / layoutWithLines().
 */
export function prepare(
  text: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  italic = false,
  fontFamily?: string,
  letterSpacing = 0,
): PreparedText {
  const r = resolveFont(weight, italic, fontFamily, fontSize, letterSpacing)
  const raw = getTextMeasurer().segmentAndMeasure(
    text, r.fontFamily, r.fontSize, r.fontWeight, r.fontStyle, r.letterSpacing,
  )
  return {
    text,
    segments: parseRaw(text, raw),
    lineHeight: fontSize * 1.5,
    fontFamily: r.fontFamily,
    fontSize,
    __brand: 'PreparedText',
  } as PreparedText
}

/** Width of the full string with no wrapping. */
export function measureNaturalWidth(
  text: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  italic = false,
  fontFamily?: string,
  letterSpacing = 0,
): number {
  const r = resolveFont(weight, italic, fontFamily, fontSize, letterSpacing)
  return getTextMeasurer().measureNaturalWidth(
    text, r.fontFamily, r.fontSize, r.fontWeight, r.fontStyle, r.letterSpacing,
  )
}

/**
 * Find the largest font size in [minSize, maxSize] such that `text` fits
 * within maxWidth × maxHeight.
 */
export function fitFontSize(
  text: string,
  weight: TextWeight = 'regular',
  maxWidth: number,
  maxHeight: number,
  minSize = 8,
  maxSize = 72,
  italic = false,
  fontFamily?: string,
): number {
  let lo = minSize
  let hi = maxSize

  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    const r = resolveFont(weight, italic, fontFamily, mid)
    const w = getTextMeasurer().measureNaturalWidth(
      text, r.fontFamily, mid, r.fontWeight, r.fontStyle, 0,
    )
    if (w <= maxWidth && mid * 1.5 <= maxHeight) {
      lo = mid
    } else {
      hi = mid - 1
    }
  }

  return lo
}
