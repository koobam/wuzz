import type {
  PreparedText,
  ObstacleShape,
  ObstacleLayoutResult,
  ObstacleLayoutLine,
} from './types'
import { layoutNextLine } from './layout'

interface LineSlot { x: number; width: number }

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Flow text around circular / rectangular obstacles.
 * Each line is placed in the widest available horizontal slot at that Y.
 */
export function layoutWithObstacles(
  prepared: PreparedText,
  containerWidth: number,
  obstacles: ObstacleShape[],
  containerHeight = Infinity,
  minSlotWidth = 50,
): ObstacleLayoutResult {
  const lines: ObstacleLayoutLine[] = []
  let y = 0
  let segIndex = 0
  const lh = prepared.lineHeight

  while (segIndex < prepared.segments.length && y < containerHeight) {
    const slots = carveTextLineSlots(y, y + lh, containerWidth, obstacles, minSlotWidth)

    for (const slot of slots) {
      if (segIndex >= prepared.segments.length) break
      const line = layoutNextLine(prepared, segIndex, slot.width)
      if (!line) break

      lines.push({
        text: line.text,
        x: slot.x,
        y,
        width: line.width,
        height: lh,
      })
      segIndex = line.segmentEnd
    }

    y += lh
  }

  return { lines, totalHeight: y }
}

/**
 * Returns horizontal slots available for text at a given line band,
 * accounting for overlapping obstacles.
 */
export function carveTextLineSlots(
  lineTop: number,
  lineBottom: number,
  containerWidth: number,
  obstacles: ObstacleShape[],
  minSlotWidth = 50,
): LineSlot[] {
  const blocked: [number, number][] = []

  for (const obs of obstacles) {
    if (obs.type === 'rect') {
      const { x, y, width, height } = obs
      if (lineTop < y + height && lineBottom > y) {
        blocked.push([x, x + width])
      }
    } else {
      const { x, y, radius } = obs
      const midY = (lineTop + lineBottom) / 2
      const dy = midY - y
      if (Math.abs(dy) < radius) {
        const half = Math.sqrt(radius * radius - dy * dy)
        blocked.push([x - half, x + half])
      }
    }
  }

  // Merge overlapping blocked ranges
  blocked.sort((a, b) => a[0]! - b[0]!)
  const merged: [number, number][] = []
  for (const [s, e] of blocked) {
    if (merged.length && s <= merged[merged.length - 1]![1]) {
      merged[merged.length - 1]![1] = Math.max(merged[merged.length - 1]![1], e)
    } else {
      merged.push([s, e])
    }
  }

  // Convert gaps into slots
  const slots: LineSlot[] = []
  let cursor = 0

  for (const [bs, be] of merged) {
    const slotEnd = Math.min(bs, containerWidth)
    const w = slotEnd - cursor
    if (w >= minSlotWidth) slots.push({ x: cursor, width: w })
    cursor = Math.max(cursor, be)
  }

  if (cursor < containerWidth) {
    const w = containerWidth - cursor
    if (w >= minSlotWidth) slots.push({ x: cursor, width: w })
  }

  return slots.length > 0 ? slots : [{ x: 0, width: containerWidth }]
}
