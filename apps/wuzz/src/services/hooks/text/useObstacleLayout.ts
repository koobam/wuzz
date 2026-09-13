import { useMemo } from 'react'
import { prepare } from '../../../core/text/prepare'
import { layoutWithObstacles } from '../../../core/text/obstacle-layout'
import type { ObstacleShape, ObstacleLayoutResult } from '../../../core/text/types'
import type { TextWeight } from '../../../components/atoms/text/text.types'

/**
 * Flow text around circular / rectangular obstacles.
 * Returns per-line position data for absolute-positioned rendering.
 */
export function useObstacleLayout(
  text: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  containerWidth: number,
  obstacles: ObstacleShape[],
  italic = false,
  fontFamily?: string,
  minSlotWidth = 50,
): ObstacleLayoutResult {
  return useMemo(() => {
    if (!text || containerWidth <= 0) return { lines: [], totalHeight: 0 }
    try {
      const prepared = prepare(text, weight, fontSize, italic, fontFamily)
      return layoutWithObstacles(prepared, containerWidth, obstacles, Infinity, minSlotWidth)
    } catch {
      return { lines: [], totalHeight: 0 }
    }
  }, [text, weight, fontSize, containerWidth, obstacles, italic, fontFamily, minSlotWidth])
}
