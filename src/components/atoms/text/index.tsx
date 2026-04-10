import React, {
  useMemo,
} from 'react';
import { useWindowDimensions, Text as RNText} from 'react-native';
import Reanimated from 'react-native-reanimated';
import TextStyle, {
  createPaddingStyle,
  createTextMarginStyle,
} from './text.style';
import { TextProps } from './text.types';
import { getResponsiveValue } from '../layouts/helper';

export const Text = React.memo((props: TextProps) => {
  const {
    style,
    text,
    fill,
    type = 'b1',
    weight = 'regular',
    fontFamily,
    color,
    align,
    margin,
    padding,
    textDecorationLine,
    children,
    inheritFromParent,
    italic,
    ...rest
  } = props;

  const { width } = useWindowDimensions();

  const textWeight =
    typeof inheritFromParent === 'boolean' || inheritFromParent?.weight
      ? undefined
      : weight;

  const textColor =
    typeof inheritFromParent === 'boolean' || inheritFromParent?.color
      ? undefined
      : color;

  const textItalic =
    typeof inheritFromParent === 'boolean' || inheritFromParent?.italic
      ? undefined
      : italic;

  const resolvedType = useMemo(() => {
    if (typeof type === 'object') {
      return getResponsiveValue(type, width);
    }
    if (typeof inheritFromParent === 'boolean' || inheritFromParent?.type) {
      return undefined;
    }
    return type;
  }, [type, width, inheritFromParent]);

  const textMarginStyle = createTextMarginStyle(margin);
  const textPaddingStyle = createPaddingStyle(padding);

  return (
    <RNText
      accessibilityRole="text"
      style={[
        TextStyle({
          type: resolvedType,
          weight: textWeight,
          fontFamily,
          color: textColor,
          fill,
          italic: textItalic,
          textDecorationLine: textDecorationLine,
          align,
        }).text,
        textMarginStyle?.margin,
        textPaddingStyle?.padding,
        style,
      ]}
      {...rest}
    >
      {text || children}
    </RNText>
  );
});

export const ReanimatedText = Reanimated.createAnimatedComponent(Text);
export default Text;
