import type { HybridObject } from 'react-native-nitro-modules'

/**
 * Nitro spec for native text measurement.
 * After editing this file, run: npx nitrogen
 *
 * All methods are synchronous JSI calls — zero bridge overhead.
 *
 * Segment encoding (flat number[]):
 *   [utf16Start₀, utf16End₀, width₀, utf16Start₁, utf16End₁, width₁, …]
 *
 * FontMetrics encoding:
 *   [ascender, descender, capHeight, xHeight, lineHeight, leading]
 *
 * InkBounds encoding:
 *   [x, y, width, height, inkLeft, inkRight]
 */
export interface TextMeasurer
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Segment text at word boundaries and return each segment's width.
   * Result is a flat array: [start, end, width, start, end, width, …]
   */
  segmentAndMeasure(
    text: string,
    fontFamily: string,
    fontSize: number,
    fontWeight: string,
    fontStyle: string,
    letterSpacing: number,
  ): number[]

  /** Width of the full string with no wrapping. */
  measureNaturalWidth(
    text: string,
    fontFamily: string,
    fontSize: number,
    fontWeight: string,
    fontStyle: string,
    letterSpacing: number,
  ): number

  /** [ascender, descender, capHeight, xHeight, lineHeight, leading] */
  getFontMetrics(fontFamily: string, fontSize: number): number[]

  /**
   * Actual ink bounding box — accounts for italic glyph overshoot.
   * [x, y, width, height, inkLeft, inkRight]
   */
  measureInkBounds(
    text: string,
    fontFamily: string,
    fontSize: number,
    fontWeight: string,
    fontStyle: string,
  ): number[]

  clearCache(): void
  setCacheBudget(bytes: number): void
}
