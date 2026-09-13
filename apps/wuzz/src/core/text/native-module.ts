import { NitroModules } from 'react-native-nitro-modules'
import type { TextMeasurer } from 'wuzz-nitro-text'

let _instance: TextMeasurer | null = null

export function getTextMeasurer(): TextMeasurer {
  if (!_instance) {
    _instance = NitroModules.createHybridObject<TextMeasurer>('TextMeasurer')
  }
  return _instance
}
