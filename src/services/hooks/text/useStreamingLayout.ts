import { useState, useCallback, useRef } from 'react'
import { prepareStreaming } from '../../../core/text/streaming'
import { layout, layoutWithLines } from '../../../core/text/layout'
import type { StreamingPreparedText, LayoutResult, LayoutLine } from '../../../core/text/types'
import type { TextWeight } from '../../../components/atoms/text/text.types'

interface State {
  result: LayoutResult
  lines: LayoutLine[]
}

/**
 * Layout engine for token-by-token AI chat streaming.
 * Call `push(newText)` each time a new token arrives.
 * Only the suffix is measured — previous segments are cached.
 */
export function useStreamingLayout(
  weight: TextWeight = 'regular',
  fontSize = 16,
  maxWidth: number,
  italic = false,
  fontFamily?: string,
) {
  const preparedRef = useRef<StreamingPreparedText | undefined>(undefined)
  const [state, setState] = useState<State>({
    result: { lineCount: 0, height: 0 },
    lines: [],
  })

  const push = useCallback(
    (newText: string) => {
      const prepared = prepareStreaming(
        newText, weight, fontSize, italic, fontFamily, preparedRef.current,
      )
      preparedRef.current = prepared
      const p = prepared as unknown as Parameters<typeof layout>[0]
      setState({
        result: layout(p, maxWidth),
        lines: layoutWithLines(p, maxWidth),
      })
    },
    [weight, fontSize, maxWidth, italic, fontFamily],
  )

  const reset = useCallback(() => {
    preparedRef.current = undefined
    setState({ result: { lineCount: 0, height: 0 }, lines: [] })
  }, [])

  return { ...state.result, lines: state.lines, push, reset }
}
