import { Platform, StyleSheet } from 'react-native';
import {
  RecordTextStyleType,
  RecordTextStyleWeight,
  TextMarginType,
  TextPaddingType,
  TextStyleProps,
} from './Text.types';

// Each variant maps to a specific Poppins font file via `fontFamily` only.
// Using fontWeight/fontStyle here can make React Native synthesize a faux face
// instead of loading the actual font file, which breaks italic and extra-bold.
export const TextStyleWeight: RecordTextStyleWeight = StyleSheet.create({
  light: { fontFamily: 'Poppins-Light' },
  lightItalic: { fontFamily: 'Poppins-LightItalic' },
  regular: { fontFamily: 'Poppins-Regular' },
  regularItalic: { fontFamily: 'Poppins-Italic' },
  medium: { fontFamily: 'Poppins-Medium' },
  mediumItalic: { fontFamily: 'Poppins-MediumItalic' },
  semibold: { fontFamily: 'Poppins-SemiBold' },
  semiboldItalic: { fontFamily: 'Poppins-SemiBoldItalic' },
  bold: { fontFamily: 'Poppins-Bold' },
  boldItalic: { fontFamily: 'Poppins-BoldItalic' },
  extrabold: { fontFamily: 'Poppins-ExtraBold' },
  extraboldItalic: { fontFamily: 'Poppins-ExtraBoldItalic' },
  stylized: { fontFamily: Platform.OS === 'ios' ? 'Fredoka One' : 'FredokaOne-Regular' },
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
