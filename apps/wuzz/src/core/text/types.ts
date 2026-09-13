export interface SegmentResult {
  text: string
  width: number
  startIndex: number
  endIndex: number
}

export interface FontMetrics {
  ascender: number
  descender: number
  capHeight: number
  xHeight: number
  lineHeight: number
  leading: number
}

export interface InkBounds {
  x: number
  y: number
  width: number
  height: number
  inkLeft: number
  inkRight: number
}

export interface LayoutLine {
  text: string
  width: number
  segmentStart: number
  segmentEnd: number
}

export interface LayoutResult {
  lineCount: number
  height: number
}

/** Opaque handle — do not mutate. Pass to layout() / layoutWithLines(). */
export interface PreparedText {
  readonly text: string
  readonly segments: SegmentResult[]
  readonly lineHeight: number
  readonly fontFamily: string
  readonly fontSize: number
  readonly __brand: 'PreparedText'
}

export interface StreamingPreparedText {
  text: string
  segments: SegmentResult[]
  lineHeight: number
  complete: boolean
}

export type ObstacleShape =
  | { type: 'rect'; x: number; y: number; width: number; height: number }
  | { type: 'circle'; x: number; y: number; radius: number }

export interface ObstacleLayoutResult {
  lines: ObstacleLayoutLine[]
  totalHeight: number
}

export interface ObstacleLayoutLine {
  text: string
  x: number
  y: number
  width: number
  height: number
}

export interface TextMorphData {
  fromSegments: SegmentResult[]
  toSegments: SegmentResult[]
  commonPrefix: string
  commonPrefixWidth: number
}
