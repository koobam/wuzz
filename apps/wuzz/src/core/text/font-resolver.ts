import { Platform } from 'react-native'
import type { TextWeight } from '../../components/atoms/text/text.types'

export interface ResolvedFont {
  fontFamily: string
  fontSize: number
  fontWeight: string
  fontStyle: 'normal' | 'italic'
  letterSpacing: number
}

const WEIGHT_MAP: Record<
  TextWeight,
  { family: string; italicFamily: string; cssWeight: string }
> = {
  light: {
    family: 'Nunito-Light',
    italicFamily: 'Nunito-LightItalic',
    cssWeight: '300',
  },
  regular: {
    family: 'Nunito-Regular',
    italicFamily: 'Nunito-Italic',
    cssWeight: '400',
  },
  medium: {
    family: 'Nunito-Medium',
    italicFamily: 'Nunito-MediumItalic',
    cssWeight: '500',
  },
  semibold: {
    family: 'Nunito-SemiBold',
    italicFamily: 'Nunito-SemiBoldItalic',
    cssWeight: '600',
  },
  bold: {
    family: 'Nunito-Bold',
    italicFamily: 'Nunito-BoldItalic',
    cssWeight: '700',
  },
  extrabold: {
    family: 'Nunito-ExtraBold',
    italicFamily: 'Nunito-ExtraBoldItalic',
    cssWeight: '800',
  },
  stylized: {
    family: Platform.OS === 'ios' ? 'Fredoka One' : 'FredokaOne-Regular',
    italicFamily: Platform.OS === 'ios' ? 'Fredoka One' : 'FredokaOne-Regular',
    cssWeight: '400',
  },
}

export function resolveFont(
  weight: TextWeight = 'regular',
  italic = false,
  overrideFontFamily?: string,
  fontSize = 16,
  letterSpacing = 0,
): ResolvedFont {
  if (overrideFontFamily) {
    return {
      fontFamily: overrideFontFamily,
      fontSize,
      fontWeight: '400',
      fontStyle: italic ? 'italic' : 'normal',
      letterSpacing,
    }
  }

  const { family, italicFamily, cssWeight } = WEIGHT_MAP[weight]
  return {
    fontFamily: italic ? italicFamily : family,
    fontSize,
    fontWeight: cssWeight,
    fontStyle: italic ? 'italic' : 'normal',
    letterSpacing,
  }
}
