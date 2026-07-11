import { Platform, StyleSheet } from 'react-native';
import {
  RecordTextStyleType,
  RecordTextStyleWeight,
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
export const TextStyleWeight: RecordTextStyleWeight = StyleSheet.create({
  light:         { fontWeight: '300', fontFamily: 'Poppins-Light' },
  lightItalic:   { fontWeight: '300', fontFamily: 'Poppins-LightItalic', fontStyle: 'italic' },
  regular:       { fontWeight: '400', fontFamily: 'Poppins-Regular' },
  regularItalic: { fontWeight: '400', fontFamily: 'Poppins-Italic', fontStyle: 'italic' },
  medium:        { fontWeight: '500', fontFamily: 'Poppins-Medium' },
  mediumItalic:  { fontWeight: '500', fontFamily: 'Poppins-MediumItalic', fontStyle: 'italic' },
  semibold:      { fontWeight: '600', fontFamily: 'Poppins-SemiBold' },
  semiboldItalic:{ fontWeight: '600', fontFamily: 'Poppins-SemiBoldItalic', fontStyle: 'italic' },
  bold:          { fontWeight: 'bold', fontFamily: 'Poppins-Bold' },
  boldItalic:    { fontWeight: 'bold', fontFamily: 'Poppins-BoldItalic', fontStyle: 'italic' },
  extrabold:     { fontWeight: '800', fontFamily: 'Poppins-ExtraBold' },
  extraboldItalic:{ fontWeight: '800', fontFamily: 'Poppins-ExtraBoldItalic', fontStyle: 'italic' },
  stylized:      { fontWeight: '400', fontFamily: Platform.OS === 'ios' ? 'Fredoka One' : 'FredokaOne-Regular', fontStyle: 'normal' },
});

export const TextStyleType: RecordTextStyleType = StyleSheet.create({
  h1: { fontSize: 36, lineHeight: 54 },
  h2: { fontSize: 32, lineHeight: 48 },
  h3: { fontSize: 28, lineHeight: 42 },
  s1: { fontSize: 24, lineHeight: 36 },
  s2: { fontSize: 20, lineHeight: 30 },
  s3: { fontSize: 18, lineHeight: 27 },
  b1: { fontSize: 16, lineHeight: 24 },
  b2: { fontSize: 14, lineHeight: 21 },
  l1: { fontSize: 12, lineHeight: 18 },
  l2: { fontSize: 10, lineHeight: 15 },
  l3: { fontSize: 9,  lineHeight: 13.5 },
});

const LINE_HEIGHT_RATIO = 1.4;

export const createTextMarginStyle = (margin?: TextMarginType) => {
  if (typeof margin === 'undefined') { return undefined; }
  if (typeof margin === 'number') { return StyleSheet.create({ margin: { margin } }); }
  return StyleSheet.create({ margin });
};

export const createPaddingStyle = (padding?: TextPaddingType) => {
  if (typeof padding === 'undefined') { return undefined; }
  if (typeof padding === 'number') { return StyleSheet.create({ padding: { padding } }); }
  return StyleSheet.create({ padding });
};

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
