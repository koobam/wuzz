package com.margelo.nitro.com.wuzz.nitrotext

import android.graphics.Paint
import android.graphics.Rect
import android.graphics.Typeface
import android.text.TextPaint
import java.text.BreakIterator

class HybridTextMeasurer : HybridTextMeasurerSpec() {

  // ── Cache ────────────────────────────────────────────────────────────────

  private val segmentCache = LinkedHashMap<String, DoubleArray>(256, 0.75f, true)
  private val metricsCache = LinkedHashMap<String, DoubleArray>(64, 0.75f, true)
  private var cacheBudget = 10 * 1024 * 1024

  private fun key(vararg parts: String) = parts.joinToString("")

  // ── Font resolution ──────────────────────────────────────────────────────

  private fun resolveTypeface(fontFamily: String, fontWeight: String, fontStyle: String): Typeface {
    val italic = fontStyle == "italic"
    val bold = fontWeight == "700" || fontWeight == "bold" ||
               fontWeight == "800" || fontWeight == "900"

    val style = when {
      italic && bold -> Typeface.BOLD_ITALIC
      italic         -> Typeface.ITALIC
      bold           -> Typeface.BOLD
      else           -> Typeface.NORMAL
    }

    // Try exact PostScript name (Poppins-SemiBold, FredokaOne-Regular, etc.)
    return try {
      Typeface.create(fontFamily, style)
    } catch (_: Exception) {
      Typeface.create(Typeface.DEFAULT, style)
    }
  }

  private fun makePaint(
    fontFamily: String,
    fontSize: Double,
    fontWeight: String,
    fontStyle: String,
    letterSpacing: Double,
  ): TextPaint = TextPaint().apply {
    textSize = fontSize.toFloat()
    typeface = resolveTypeface(fontFamily, fontWeight, fontStyle)
    if (letterSpacing != 0.0) {
      this.letterSpacing = (letterSpacing / fontSize).toFloat()
    }
    isAntiAlias = true
  }

  // ── segmentAndMeasure ────────────────────────────────────────────────────

  override fun segmentAndMeasure(
    text: String,
    fontFamily: String,
    fontSize: Double,
    fontWeight: String,
    fontStyle: String,
    letterSpacing: Double,
  ): DoubleArray {
    val k = key(text, fontFamily, "$fontSize", fontWeight, fontStyle, "$letterSpacing")
    segmentCache[k]?.let { return it }

    val paint = makePaint(fontFamily, fontSize, fontWeight, fontStyle, letterSpacing)
    val result = mutableListOf<Double>()

    val bi = BreakIterator.getWordInstance()
    bi.setText(text)

    var start = bi.first()
    var end = bi.next()

    while (end != BreakIterator.DONE) {
      val seg = text.substring(start, end)
      val w = paint.measureText(seg).toDouble()
      result += listOf(start.toDouble(), end.toDouble(), w)
      start = end
      end = bi.next()
    }

    val arr = result.toDoubleArray()
    segmentCache[k] = arr
    trimCacheIfNeeded()
    return arr
  }

  // ── measureNaturalWidth ──────────────────────────────────────────────────

  override fun measureNaturalWidth(
    text: String,
    fontFamily: String,
    fontSize: Double,
    fontWeight: String,
    fontStyle: String,
    letterSpacing: Double,
  ): Double {
    val paint = makePaint(fontFamily, fontSize, fontWeight, fontStyle, letterSpacing)
    return paint.measureText(text).toDouble()
  }

  // ── getFontMetrics ───────────────────────────────────────────────────────

  override fun getFontMetrics(fontFamily: String, fontSize: Double): DoubleArray {
    val k = key(fontFamily, "$fontSize")
    metricsCache[k]?.let { return it }

    val paint = Paint().apply {
      textSize = fontSize.toFloat()
      typeface = resolveTypeface(fontFamily, "400", "normal")
      isAntiAlias = true
    }

    val fm = paint.fontMetrics
    val ascender  = (-fm.ascent).toDouble()
    val descender = fm.descent.toDouble()
    val leading   = fm.leading.toDouble()
    val lineH     = ascender + descender + leading

    // Android doesn't expose capHeight/xHeight directly — measure proxy glyphs
    val capHeight = paint.measureText("H").toDouble()
    val xHeight   = paint.measureText("x").toDouble()

    val arr = doubleArrayOf(ascender, descender, capHeight, xHeight, lineH, leading)
    metricsCache[k] = arr
    return arr
  }

  // ── measureInkBounds ────────────────────────────────────────────────────

  override fun measureInkBounds(
    text: String,
    fontFamily: String,
    fontSize: Double,
    fontWeight: String,
    fontStyle: String,
  ): DoubleArray {
    val paint = makePaint(fontFamily, fontSize, fontWeight, fontStyle, 0.0)
    val bounds = Rect()
    paint.getTextBounds(text, 0, text.length, bounds)
    val typWidth = paint.measureText(text).toDouble()

    return doubleArrayOf(
      bounds.left.toDouble(),
      bounds.top.toDouble(),
      typWidth,
      bounds.height().toDouble(),
      bounds.left.toDouble(),
      (bounds.left + bounds.width()).toDouble(),
    )
  }

  // ── Cache management ─────────────────────────────────────────────────────

  override fun clearCache() {
    segmentCache.clear()
    metricsCache.clear()
  }

  override fun setCacheBudget(bytes: Double) {
    cacheBudget = bytes.toInt()
    trimCacheIfNeeded()
  }

  private fun trimCacheIfNeeded() {
    while (segmentCache.size > 2000) {
      segmentCache.entries.firstOrNull()?.key?.let { segmentCache.remove(it) }
    }
  }
}
