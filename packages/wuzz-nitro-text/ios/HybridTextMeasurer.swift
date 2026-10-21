import Foundation
import UIKit
import CoreText
import NitroModules

final class HybridTextMeasurer: HybridTextMeasurerSpec {

  // MARK: - Cache

  private var segmentCache: [String: [Double]] = [:]
  private var metricsCache: [String: [Double]] = [:]
  private var cacheBudget: Int = 10 * 1024 * 1024

  private func cacheKey(_ parts: String...) -> String { parts.joined(separator: "\u{1F}") }

  // MARK: - Font resolution

  private func resolveFont(
    fontFamily: String,
    fontSize: Double,
    fontWeight: String,
    fontStyle: String
  ) -> UIFont {
    // Try exact PostScript name first (Nunito-SemiBold, FredokaOne-Regular, etc.)
    if let f = UIFont(name: fontFamily, size: CGFloat(fontSize)) { return f }

    // Fallback: system font with closest weight
    let weight: UIFont.Weight
    switch fontWeight {
    case "100": weight = .ultraLight
    case "200": weight = .thin
    case "300": weight = .light
    case "500": weight = .medium
    case "600": weight = .semibold
    case "700", "bold": weight = .bold
    case "800": weight = .heavy
    case "900": weight = .black
    default: weight = .regular
    }

    var traits: UIFontDescriptor.SymbolicTraits = []
    if fontStyle == "italic" { traits.insert(.traitItalic) }

    let base = UIFont.systemFont(ofSize: CGFloat(fontSize), weight: weight)
    if !traits.isEmpty, let d = base.fontDescriptor.withSymbolicTraits(traits) {
      return UIFont(descriptor: d, size: CGFloat(fontSize))
    }
    return base
  }

  // MARK: - segmentAndMeasure

  func segmentAndMeasure(
    text: String,
    fontFamily: String,
    fontSize: Double,
    fontWeight: String,
    fontStyle: String,
    letterSpacing: Double
  ) throws -> [Double] {
    let key = cacheKey(text, fontFamily, "\(fontSize)", fontWeight, fontStyle, "\(letterSpacing)")
    if let cached = segmentCache[key] { return cached }

    let font = resolveFont(fontFamily: fontFamily, fontSize: fontSize, fontWeight: fontWeight, fontStyle: fontStyle)
    var attrs: [NSAttributedString.Key: Any] = [.font: font]
    if letterSpacing != 0 { attrs[.kern] = letterSpacing }

    let ns = text as NSString
    let cfText = text as CFString
    let fullRange = CFRangeMake(0, CFStringGetLength(cfText))

    let tokenizer = CFStringTokenizerCreate(
      kCFAllocatorDefault, cfText, fullRange,
      kCFStringTokenizerUnitWordBoundary, nil
    )

    var result: [Double] = []
    var lastEnd = 0
    var tokenType = CFStringTokenizerAdvanceToNextToken(tokenizer)

    while tokenType.rawValue != 0 {
      let r = CFStringTokenizerGetCurrentTokenRange(tokenizer)
      let start = r.location
      let end = r.location + r.length

      // Gap between tokens (spaces / punctuation run)
      if lastEnd < start {
        appendSegment(ns: ns, start: lastEnd, end: start, attrs: attrs, into: &result)
      }

      appendSegment(ns: ns, start: start, end: end, attrs: attrs, into: &result)
      lastEnd = end
      tokenType = CFStringTokenizerAdvanceToNextToken(tokenizer)
    }

    // Trailing content
    let total = ns.length
    if lastEnd < total {
      appendSegment(ns: ns, start: lastEnd, end: total, attrs: attrs, into: &result)
    }

    segmentCache[key] = result
    trimCacheIfNeeded()
    return result
  }

  private func appendSegment(
    ns: NSString,
    start: Int,
    end: Int,
    attrs: [NSAttributedString.Key: Any],
    into result: inout [Double]
  ) {
    guard start < end else { return }
    let s = ns.substring(with: NSRange(location: start, length: end - start))
    let attr = NSAttributedString(string: s, attributes: attrs)
    let w = attr.boundingRect(
      with: CGSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude),
      options: [],
      context: nil
    ).width
    result.append(Double(start))
    result.append(Double(end))
    result.append(Double(w))
  }

  // MARK: - measureNaturalWidth

  func measureNaturalWidth(
    text: String,
    fontFamily: String,
    fontSize: Double,
    fontWeight: String,
    fontStyle: String,
    letterSpacing: Double
  ) throws -> Double {
    let font = resolveFont(fontFamily: fontFamily, fontSize: fontSize, fontWeight: fontWeight, fontStyle: fontStyle)
    var attrs: [NSAttributedString.Key: Any] = [.font: font]
    if letterSpacing != 0 { attrs[.kern] = letterSpacing }
    let r = (text as NSString).boundingRect(
      with: CGSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude),
      options: [],
      attributes: attrs,
      context: nil
    )
    return Double(r.width)
  }

  // MARK: - getFontMetrics

  func getFontMetrics(fontFamily: String, fontSize: Double) throws -> [Double] {
    let key = cacheKey(fontFamily, "\(fontSize)")
    if let cached = metricsCache[key] { return cached }

    let font = resolveFont(fontFamily: fontFamily, fontSize: fontSize, fontWeight: "400", fontStyle: "normal")

    // capHeight & xHeight via CoreText for accuracy
    let ctFont = CTFontCreateWithName(fontFamily as CFString, CGFloat(fontSize), nil)
    let capH = Double(CTFontGetCapHeight(ctFont))
    let xH   = Double(CTFontGetXHeight(ctFont))

    let result: [Double] = [
      Double(font.ascender),
      Double(-font.descender),
      capH > 0 ? capH : Double(font.capHeight),
      xH  > 0 ? xH  : Double(font.xHeight),
      Double(font.lineHeight),
      Double(font.leading),
    ]
    metricsCache[key] = result
    return result
  }

  // MARK: - measureInkBounds

  func measureInkBounds(
    text: String,
    fontFamily: String,
    fontSize: Double,
    fontWeight: String,
    fontStyle: String
  ) throws -> [Double] {
    let font = resolveFont(fontFamily: fontFamily, fontSize: fontSize, fontWeight: fontWeight, fontStyle: fontStyle)
    let attrs: [NSAttributedString.Key: Any] = [.font: font]
    let attr = NSAttributedString(string: text, attributes: attrs)

    // Typographic bounds (container)
    let line = CTLineCreateWithAttributedString(attr)
    var ascent: CGFloat = 0
    var descent: CGFloat = 0
    var leading: CGFloat = 0
    let typWidth = CTLineGetTypographicBounds(line, &ascent, &descent, &leading)

    // Actual ink bounds — captures italic overshoot
    let ink = CTLineGetImageBounds(line, nil)

    return [
      Double(ink.origin.x),
      Double(ink.origin.y),
      Double(typWidth),
      Double(ascent + descent),
      Double(ink.origin.x),
      Double(ink.origin.x + ink.width),
    ]
  }

  // MARK: - Cache management

  func clearCache() throws {
    segmentCache.removeAll()
    metricsCache.removeAll()
  }

  func setCacheBudget(bytes: Double) throws {
    cacheBudget = Int(bytes)
    trimCacheIfNeeded()
  }

  private func trimCacheIfNeeded() {
    // Rough eviction: drop oldest half when over entry limit
    if segmentCache.count > 2000 {
      let half = segmentCache.count / 2
      segmentCache.keys.prefix(half).forEach { segmentCache.removeValue(forKey: $0) }
    }
  }
}
