import {TextProps as RNTextProps, TextStyle as RNTextStyle} from 'react-native';
import theme from '../theme';

export type TextMarginType =
  | {
      marginTop?: number;
      marginBottom?: number;
      marginRight?: number;
      marginLeft?: number;
      marginHorizontal?: number;
      marginVertical?: number;
    }
  | number;

export type TextPaddingType =
  | {
      paddingTop?: number;
      paddingBottom?: number;
      paddingRight?: number;
      paddingLeft?: number;
      paddingHorizontal?: number;
      paddingVertical?: number;
    }
  | number;

export interface TextProps extends RNTextProps {
  lineHeight?: number;
  weight?: TextWeight;
  /**
   * Override font family (e.g. 'FredokaOne-Regular' for display/brand text).
   */
  fontFamily?: string;
  italic?: boolean;
  text?: string;
  width?: number | string;
  type?: TextType | Record<keyof typeof theme.breakpoints, TextType>;
  fill?: boolean;
  textDecorationLine?: RNTextStyle['textDecorationLine'];
  style?: RNTextStyle;
  align?: RNTextStyle['textAlign'];
  color?: RNTextStyle['color'];
  margin?: TextMarginType;
  padding?: TextPaddingType;
  opacity?: number;
  borderRadius?: number;
  maxWidth?: number;
  /**
   * Inherit the type, weight, color, or even the all three from it's parent.
   */
  inheritFromParent?:
    | {
        type?: boolean;
        weight?: boolean;
        color?: boolean;
        italic?: boolean;
      }
    | boolean;
}

export interface TextStyleProps {
  weight?: TextWeight;
  fontFamily?: string;
  fill?: boolean;
  type?: TextType;
  italic?: boolean;
  textDecorationLine?: RNTextStyle['textDecorationLine'];
  color?: RNTextStyle['color'];
  align?: RNTextStyle['textAlign'];
}

export type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'stylized';
export type TextType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 's1'
  | 's2'
  | 's3'
  | 'b1'
  | 'b2'
  | 'l1'
  | 'l2'
  | 'l3';

export type RecordTextStyleWeight = Record<TextWeight, RNTextStyle>;

export type RecordTextStyleType = Record<TextType, RNTextStyle>;
export type RecordTextStyle = Record<
  'TextStyleType' | 'TextStyleWeight',
  RecordTextStyleType | RecordTextStyleWeight
>;

export type TypingTextProps = TextProps & {
  content: string;
  pitch?: number; // nada suara (0-255)
  speed?: number; // kecepatan ketik per karakter (ms)
  animalese?: boolean; // apakah menggunakan suara animalese
  onTypingEnd?: () => void;
};
