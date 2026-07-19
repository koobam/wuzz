import React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import NativeShimmerView from './NativeShimmerView'

export interface ShimmerProps {
  width?: number | string
  height?: number | string
  borderRadius?: number
  duration?: number
  shimmerColor?: string
  highlightOpacity?: number
  style?: StyleProp<ViewStyle>
}

export const Shimmer = ({
  width = '100%',
  height = 24,
  borderRadius = 0,
  duration = 1800,
  shimmerColor = '#E0E0E0',
  highlightOpacity = 0.7,
  style,
}: ShimmerProps) =>
  React.createElement(NativeShimmerView, {
    duration,
    borderRadius,
    shimmerColor,
    highlightOpacity,
    style: [{ width: width as number, height: height as number, overflow: 'hidden' as const }, style],
  })

export type { ShimmerViewProps } from './ShimmerView.nitro'
