import { getHostComponent } from 'react-native-nitro-modules'
import type { ShimmerViewProps } from './ShimmerView.nitro'

/**
 * Low-level Nitro host component.
 * Use the <Shimmer> wrapper from index.ts instead.
 *
 * Generated bridge: run `npx nitrogen` then `pod install` before building.
 */
const NativeShimmerView = getHostComponent<ShimmerViewProps, {}>('ShimmerView', () => ({
  uiViewClassName: 'ShimmerView',
  bubblingEventTypes: {},
  directEventTypes: {},
  validAttributes: {
    duration:         true,
    borderRadius:     true,
    shimmerColor:     true,
    highlightOpacity: true,
  },
}))

export default NativeShimmerView
