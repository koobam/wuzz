import React, { useMemo, memo } from 'react';
import Divider from '../divider';
import { getValidChildren } from '../helper';
import { StackProps } from './stack.types';
import Flex from '../flex';
import Animated from 'react-native-reanimated';

export const Stack = memo(
  ({ divider = false, dividerStyle, spacing, ref, ...rest }: StackProps) => {
    const direction = useMemo(
      () => (rest.inline ? 'row' : rest.direction || 'column'),
      [rest.inline, rest.direction],
    );

    const validChildren = getValidChildren(rest.children);

    const clones = validChildren.map((child, index) => {
      const key = child.key !== undefined ? child.key : index;
      const isLast = index === validChildren.length - 1;

      if (!divider && !spacing) {
        return child;
      }

      const dividerElement = React.isValidElement(divider) ? (
        divider
      ) : (
        <Divider
          thickness={spacing}
          horizontal={direction === 'row' || direction === 'row-reverse'}
        />
      );

      const clonedDivider = React.cloneElement(dividerElement, {
        key: `${key}-divider`,
        style: [
          dividerElement.props?.style,
          dividerStyle,
        ].filter(Boolean),
      });

      const _divider = isLast ? null : clonedDivider;

      return [child, _divider];
    });

    const stackedChildren = divider
      ? clones.flat().filter(Boolean)
      : clones.flat();

    return (
      <Flex ref={ref} {...rest} direction={direction}>
        {stackedChildren}
      </Flex>
    );
  },
);

const AnimatedStack = Animated.createAnimatedComponent(Stack);
AnimatedStack.displayName = 'AnimatedStack';
export { AnimatedStack };
Stack.displayName = 'Stack';
export default Stack;
