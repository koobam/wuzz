import type { PreparedText, LayoutResult, LayoutLine } from './types'

// ── Public API ────────────────────────────────────────────────────────────

/** Fast line-count + height. Pure arithmetic — zero native calls. */
export function layout(prepared: PreparedText, maxWidth: number): LayoutResult {
  const lineCount = countLines(prepared.segments, maxWidth)
  return { lineCount, height: lineCount * prepared.lineHeight }
}

/** Full line breakdown — text, width, and segment indices per line. */
export function layoutWithLines(
  prepared: PreparedText,
  maxWidth: number,
): LayoutLine[] {
  const { segments } = prepared
  const lines: LayoutLine[] = []
  let rowWidth = 0
  let rowStart = 0 // segment index
  let i = 0

  while (i < segments.length) {
    const seg = segments[i]!
    const isSpace = seg.text.trim() === ''

    if (rowWidth + seg.width > maxWidth && rowWidth > 0) {
      // Commit row
      lines.push(buildLine(segments, rowStart, i, rowWidth))
      rowStart = i
      rowWidth = 0
      // Skip leading whitespace on the new row
      if (isSpace) { rowStart = i + 1; i++; continue }
    }

    rowWidth += seg.width
    i++
  }

  if (rowStart < segments.length) {
    lines.push(buildLine(segments, rowStart, segments.length, rowWidth))
  }

  return lines
}

/**
 * Compute a single line starting at segIndex.
 * Returns null when there are no more segments.
 */
export function layoutNextLine(
  prepared: PreparedText,
  segIndex: number,
  maxWidth: number,
): LayoutLine | null {
  const { segments } = prepared
  if (segIndex >= segments.length) return null

  // Skip leading whitespace
  while (segIndex < segments.length && segments[segIndex]!.text.trim() === '') {
    segIndex++
  }
  if (segIndex >= segments.length) return null

  const lineStart = segIndex
  let rowWidth = 0

  while (segIndex < segments.length) {
    const w = segments[segIndex]!.width
    if (rowWidth + w > maxWidth && rowWidth > 0) break
    rowWidth += w
    segIndex++
  }

  return buildLine(segments, lineStart, segIndex, rowWidth)
}

// ── Internals ─────────────────────────────────────────────────────────────

function countLines(
  segments: PreparedText['segments'],
  maxWidth: number,
): number {
  let count = 1
  let rowWidth = 0

  for (const seg of segments) {
    if (rowWidth + seg.width > maxWidth && rowWidth > 0) {
      count++
      rowWidth = seg.text.trim() === '' ? 0 : seg.width
    } else {
      rowWidth += seg.width
    }
  }

  return count
}

function buildLine(
  segments: PreparedText['segments'],
  from: number,
  to: number,
  width: number,
): LayoutLine {
  return {
    text: segments.slice(from, to).map(s => s.text).join(''),
    width,
    segmentStart: from,
    segmentEnd: to,
  }
}
