import {Platform, StyleSheet} from 'react-native';
import {
  RecordTextStyleType,
  TextMarginType,
  TextPaddingType,
  TextStyleProps,
} from './Text.types';

// Each variant maps to a specific Poppins font file via `fontFamily` only — do
// NOT set fontWeight/fontStyle (Android would add synthetic fake-bold / fake-
// italic and the named font can mis-resolve). The italic *.ttf files were
// patched (scripts/fix_italic_fonts) to each carry a UNIQUE internal family
// name reported as a Regular face, so they resolve on their own instead of
// colliding with the upright weight that originally shared their family name.
export const TextStyleWeight = StyleSheet.create({
  light: {
    fontFamily: 'Poppins-Light',
  },
  lightItalic: {
    fontFamily: 'Poppins-LightItalic',
  },
  regular: {
    fontFamily: 'Poppins-Regular',
  },
  regularItalic: {
    fontFamily: 'Poppins-Italic',
  },
  medium: {
    fontFamily: 'Poppins-Medium',
  },
  mediumItalic: {
    fontFamily: 'Poppins-MediumItalic',
  },
  semibold: {
    fontFamily: 'Poppins-SemiBold',
  },
  semiboldItalic: {
    fontFamily: 'Poppins-SemiBoldItalic',
  },
  bold: {
    fontFamily: 'Poppins-Bold',
  },
  boldItalic: {
    fontFamily: 'Poppins-BoldItalic',
  },
  extrabold: {
    fontFamily: 'Poppins-ExtraBold',
  },
  extraboldItalic: {
    fontFamily: 'Poppins-ExtraBoldItalic',
  },
  stylized: {
    fontFamily:
      Platform.OS === 'ios' ? 'Fredoka One' : 'FredokaOne-Regular',
    fontStyle: 'normal',
  },
});

export const createTextMarginStyle = (margin?: TextMarginType) => {
  if (typeof margin === 'undefined') {
    return undefined;
  }

  if (typeof margin === 'number') {
    return StyleSheet.create({
      margin: {margin},
    });
  }

  return StyleSheet.create({
    margin,
  });
};

export const createPaddingStyle = (padding?: TextPaddingType) => {
  if (typeof padding === 'undefined') {return;}
  if (typeof padding === 'number') {
    return StyleSheet.create({
      padding: {padding},
    });
  }

  return StyleSheet.create({
    padding,
  });
};

export const TextStyleType: RecordTextStyleType = StyleSheet.create({
  h1: {
    fontSize: 36,
  },
  h2: {
    fontSize: 32,
  },
  h3: {
    fontSize: 28,
  },
  s1: {
    fontSize: 24,
  },
  s2: {
    fontSize: 20,
  },
  s3: {
    fontSize: 18,
  },
  b1: {
    fontSize: 16,
  },
  b2: {
    fontSize: 14,
  },
  l1: {
    fontSize: 12,
  },
  l2: {
    fontSize: 10,
  },
  l3: {
    fontSize: 9,
  },
});

/**
 * Multiplier applied to fontSize to derive lineHeight. Poppins' intrinsic line
 * height is large, so we set an explicit one for consistent vertical rhythm.
 * Tune this single value to make text tighter (lower) or looser (higher).
 */
const LINE_HEIGHT_RATIO = 1.4;

const TextStyle = (props: TextStyleProps) => {
  const weightStyle = props.weight ? TextStyleWeight[props.weight] : undefined;
  const typeStyle = props.type ? TextStyleType[props.type] : undefined;
  const italicStyle =
    props.italic && props.weight
      ? TextStyleWeight[`${props.weight}Italic` as keyof typeof TextStyleWeight]
      : undefined;
  const fontSize = typeStyle?.fontSize;
  return StyleSheet.create({
    text: {
      // Remove Android's extra font-metric padding so lineHeight matches fontSize.
      includeFontPadding: false,
      textAlignVertical: 'center',
      ...weightStyle,
      ...typeStyle,
      ...italicStyle,
      ...(fontSize != null
        ? { lineHeight: Math.round(fontSize * LINE_HEIGHT_RATIO) }
        : {}),
      ...(props.fontFamily ? { fontFamily: props.fontFamily } : {}),
      flex: props.fill ? 1 : undefined,
      color: props.color,
      textAlign: props.align,
      textDecorationLine: props.textDecorationLine,
    },
  });
};

export default TextStyle;
