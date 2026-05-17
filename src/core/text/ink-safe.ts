import type { TextStyle } from 'react-native'
import { getTextMeasurer } from './native-module'
import { resolveFont } from './font-resolver'
import type { InkBounds, FontMetrics } from './types'
import type { TextWeight } from '../../components/atoms/text/text.types'

// ── Public API ────────────────────────────────────────────────────────────

export function getFontMetrics(
  weight: TextWeight = 'regular',
  fontSize = 16,
  fontFamily?: string,
): FontMetrics {
  const r = resolveFont(weight, false, fontFamily, fontSize)
  const raw = getTextMeasurer().getFontMetrics(r.fontFamily, fontSize)
  return {
    ascender:  raw[0]!,
    descender: raw[1]!,
    capHeight: raw[2]!,
    xHeight:   raw[3]!,
    lineHeight: raw[4]!,
    leading:   raw[5]!,
  }
}

export function measureInkBounds(
  text: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  italic = false,
  fontFamily?: string,
): InkBounds {
  const r = resolveFont(weight, italic, fontFamily, fontSize)
  const raw = getTextMeasurer().measureInkBounds(
    text, r.fontFamily, r.fontSize, r.fontWeight, r.fontStyle,
  )
  return {
    x: raw[0]!, y: raw[1]!, width: raw[2]!, height: raw[3]!,
    inkLeft: raw[4]!, inkRight: raw[5]!,
  }
}

/**
 * Padding to prevent italic/bold glyphs from being clipped by the container.
 * Add this to the wrapping View, not the Text itself.
 */
export function computeInkSafePadding(
  weight: TextWeight = 'regular',
  fontSize = 16,
  italic = false,
): { paddingLeft: number; paddingRight: number } {
  if (!italic) return { paddingLeft: 0, paddingRight: 0 }
  // Typical italic overshoot is ~12–18% of fontSize
  const overshoot = Math.ceil(fontSize * 0.15)
  return { paddingLeft: 0, paddingRight: overshoot }
}

/** Ready-to-spread TextStyle fragment for ink-safe rendering. */
export function getInkSafeStyle(
  weight: TextWeight = 'regular',
  fontSize = 16,
  italic = false,
): Partial<TextStyle> {
  return computeInkSafePadding(weight, fontSize, italic)
}
