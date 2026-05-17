import { useState, useEffect, useRef, useCallback } from 'react'
import { prepareStreaming } from '../../../core/text/streaming'
import { layout } from '../../../core/text/layout'
import type { StreamingPreparedText } from '../../../core/text/types'
import type { TextWeight } from '../../../components/atoms/text/text.types'

interface State {
  visibleText: string
  height: number
  isDone: boolean
}

/**
 * Typewriter effect with accurate native height measurement.
 * Call `start()` to begin; call `reset()` to clear.
 */
export function useTypewriterLayout(
  fullText: string,
  weight: TextWeight = 'regular',
  fontSize = 16,
  maxWidth: number,
  speedMs = 30,
  italic = false,
  fontFamily?: string,
) {
  const [state, setState] = useState<State>({
    visibleText: '',
    height: 0,
    isDone: false,
  })
  const indexRef  = useRef(0)
  const timerRef  = useRef<ReturnType<typeof setTimeout>>()
  const prepRef   = useRef<StreamingPreparedText | undefined>(undefined)

  const tick = useCallback(() => {
    indexRef.current++
    const visible = fullText.slice(0, indexRef.current)
    const done = indexRef.current >= fullText.length

    try {
      const prepared = prepareStreaming(visible, weight, fontSize, italic, fontFamily, prepRef.current)
      prepRef.current = prepared
      const { height } = layout(prepared as any, maxWidth)
      setState({ visibleText: visible, height, isDone: done })
    } catch {
      setState({ visibleText: visible, height: fontSize * 1.5, isDone: done })
    }

    if (!done) timerRef.current = setTimeout(tick, speedMs)
  }, [fullText, weight, fontSize, maxWidth, speedMs, italic, fontFamily])

  const start = useCallback(() => {
    clearTimeout(timerRef.current)
    indexRef.current = 0
    prepRef.current = undefined
    timerRef.current = setTimeout(tick, speedMs)
  }, [tick, speedMs])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    indexRef.current = 0
    prepRef.current = undefined
    setState({ visibleText: '', height: 0, isDone: false })
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return { ...state, start, reset }
}
