import {StyleProp, View, ViewStyle} from 'react-native';
import {FlexProps} from '../flex';
import { ResponsiveValue } from '../helper';

export interface StackProps extends FlexProps {
  ref?: React.Ref<View>;
  /**
   * The spacing between items in the stack.
   *
   * @default 0
   */
  spacing?: ResponsiveValue<number>;

  /**
   * If `true`, each stack item will show a divider.
   *
   * @default false
   */
  divider?: React.ReactElement | boolean;

  /**
   * A style object to apply to each divider.
   */
  dividerStyle?: StyleProp<ViewStyle>;

  /**
   * If `true`, the children will be wrapped in a `Box` and the `Box` will take the spacing properties.
   *
   * @default false
   */
  shouldWrapChildren?: boolean;
  inline?: boolean;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
}
