import { getTextMeasurer } from './native-module'
import { resolveFont } from './font-resolver'
import type { StreamingPreparedText, SegmentResult } from './types'
import type { TextWeight } from '../../components/atoms/text/text.types'

function parseRaw(text: string, raw: number[], offset = 0): SegmentResult[] {
  const out: SegmentResult[] = []
  for (let i = 0; i < raw.length; i += 3) {
    out.push({
      startIndex: raw[i]! + offset,
      endIndex: raw[i + 1]! + offset,
      width: raw[i + 2]!,
      text: text.slice(raw[i], raw[i + 1]),
    })
  }
  return out
}

/**
 * Incremental prepare for streaming AI output.
 * When `prev` is supplied and `newText` starts with `prev.text`, only the
 * suffix is measured — the native cache makes this nearly free.
 */
export function prepareStreaming(
  newText: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  italic = false,
  fontFamily?: string,
  prev?: StreamingPreparedText,
): StreamingPreparedText {
  const r = resolveFont(weight, italic, fontFamily, fontSize)

  if (prev && newText.startsWith(prev.text) && newText.length > prev.text.length) {
    const suffix = newText.slice(prev.text.length)
    const raw = getTextMeasurer().segmentAndMeasure(
      suffix, r.fontFamily, r.fontSize, r.fontWeight, r.fontStyle, 0,
    )
    const newSegs = parseRaw(suffix, raw, prev.text.length)
    return {
      text: newText,
      segments: [...prev.segments, ...newSegs],
      lineHeight: fontSize * 1.5,
      complete: false,
    }
  }

  const raw = getTextMeasurer().segmentAndMeasure(
    newText, r.fontFamily, r.fontSize, r.fontWeight, r.fontStyle, 0,
  )
  return {
    text: newText,
    segments: parseRaw(newText, raw),
    lineHeight: fontSize * 1.5,
    complete: false,
  }
}
