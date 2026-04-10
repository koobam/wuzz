import {Platform, StyleSheet} from 'react-native';
import {
  RecordTextStyleType,
  TextMarginType,
  TextPaddingType,
  TextStyleProps,
} from './Text.types';

export const TextStyleWeight = StyleSheet.create({
  light: {
    fontWeight: '300',
    fontFamily: 'Poppins-Light',
  },
  lightItalic: {
    fontWeight: '300',
    fontFamily: 'Poppins-LightItalic',
    fontStyle: 'italic',
  },
  regular: {
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
  },
  regularItalic: {
    fontWeight: '400',
    fontFamily: 'Poppins-Italic',
    fontStyle: 'italic',
  },
  medium: {
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  mediumItalic: {
    fontWeight: '500',
    fontFamily: 'Poppins-MediumItalic',
    fontStyle: 'italic',
  },
  semibold: {
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  semiboldItalic: {
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBoldItalic',
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  boldItalic: {
    fontWeight: 'bold',
    fontFamily: 'Poppins-BoldItalic',
    fontStyle: 'italic',
  },
  stylized: {
    fontWeight: '400',
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

const TextStyle = (props: TextStyleProps) => {
  const weightStyle = props.weight ? TextStyleWeight[props.weight] : undefined;
  const typeStyle = props.type ? TextStyleType[props.type] : undefined;
  const italicStyle =
    props.italic && props.weight
      ? TextStyleWeight[`${props.weight}Italic` as keyof typeof TextStyleWeight]
      : undefined;
  return StyleSheet.create({
    text: {
      ...weightStyle,
      ...typeStyle,
      ...italicStyle,
      ...(props.fontFamily ? { fontFamily: props.fontFamily } : {}),
      flex: props.fill ? 1 : undefined,
      color: props.color,
      textAlign: props.align,
      textDecorationLine: props.textDecorationLine,
    },
  });
};

export default TextStyle;
