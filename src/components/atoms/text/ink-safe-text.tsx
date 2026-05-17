import React from 'react'
import { View } from 'react-native'
import { Text } from './index'
import { computeInkSafePadding } from '../../../core/text/ink-safe'
import type { TextProps } from './text.types'

const TYPE_SIZE: Record<string, number> = {
  h1: 36, h2: 32, h3: 28,
  s1: 24, s2: 20, s3: 18,
  b1: 16, b2: 14,
  l1: 12, l2: 10, l3: 9,
}

/**
 * Wraps <Text> in a View with ink-safe padding to prevent italic/bold glyph
 * clipping. Use this whenever italic text gets cut off at the right edge.
 */
export const InkSafeText = React.memo((props: TextProps) => {
  const { type = 'b1', weight = 'regular', italic, style, ...rest } = props

  const fontSize =
    typeof type === 'string' ? (TYPE_SIZE[type] ?? 16) : 16

  const { paddingLeft, paddingRight } = computeInkSafePadding(weight, fontSize, !!italic)

  return (
    <View style={{ paddingLeft, paddingRight }}>
      <Text type={type} weight={weight} italic={italic} style={style} {...rest} />
    </View>
  )
})
