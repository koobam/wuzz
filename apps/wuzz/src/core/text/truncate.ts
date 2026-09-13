import { getTextMeasurer } from './native-module'
import { resolveFont } from './font-resolver'
import type { TextWeight } from '../../components/atoms/text/text.types'

type TruncateMode = 'tail' | 'head' | 'middle'

/**
 * JavaScript-side truncation — avoids RN's numberOfLines edge cases on Android.
 * Uses binary search + native width measurement for accuracy.
 */
export function truncateText(
  text: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  maxWidth: number,
  numberOfLines = 1,
  mode: TruncateMode = 'tail',
  ellipsis = '…',
  italic = false,
  fontFamily?: string,
  letterSpacing = 0,
): string {
  const r = resolveFont(weight, italic, fontFamily, fontSize, letterSpacing)
  const m = getTextMeasurer()
  const measure = (s: string) =>
    m.measureNaturalWidth(s, r.fontFamily, r.fontSize, r.fontWeight, r.fontStyle, r.letterSpacing)

  const totalBudget = maxWidth * numberOfLines
  if (measure(text) <= totalBudget) return text

  const ellipsisW = measure(ellipsis)
  const budget = totalBudget - ellipsisW

  if (mode === 'tail') return bsSlice(text, r, measure, budget, 'tail') + ellipsis
  if (mode === 'head') return ellipsis + bsSlice(text, r, measure, budget, 'head')

  // middle
  const half = budget / 2
  return (
    bsSlice(text, r, measure, half, 'tail') +
    ellipsis +
    bsSlice(text, r, measure, half, 'head')
  )
}

// ── Internals ─────────────────────────────────────────────────────────────

function bsSlice(
  text: string,
  _r: ReturnType<typeof resolveFont>,
  measure: (s: string) => number,
  budget: number,
  dir: 'tail' | 'head',
): string {
  let lo = 0
  let hi = text.length

  if (dir === 'tail') {
    while (lo < hi) {
      const mid = Math.floor((lo + hi + 1) / 2)
      measure(text.slice(0, mid)) <= budget ? (lo = mid) : (hi = mid - 1)
    }
    return text.slice(0, lo)
  }

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    measure(text.slice(mid)) <= budget ? (hi = mid) : (lo = mid + 1)
  }
  return text.slice(lo)
}
