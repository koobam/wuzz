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
    family: 'Poppins-Light',
    italicFamily: 'Poppins-LightItalic',
    cssWeight: '300',
  },
  regular: {
    family: 'Poppins-Regular',
    italicFamily: 'Poppins-Italic',
    cssWeight: '400',
  },
  medium: {
    family: 'Poppins-Medium',
    italicFamily: 'Poppins-MediumItalic',
    cssWeight: '500',
  },
  semibold: {
    family: 'Poppins-SemiBold',
    italicFamily: 'Poppins-SemiBoldItalic',
    cssWeight: '600',
  },
  bold: {
    family: 'Poppins-Bold',
    italicFamily: 'Poppins-BoldItalic',
    cssWeight: '700',
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
