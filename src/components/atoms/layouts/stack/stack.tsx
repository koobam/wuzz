import React, { memo } from 'react';
import { StackProps } from './stack.types';
import Flex from '../flex';
import Animated from 'react-native-reanimated';

export const Stack = memo(({ ref, ...rest }: StackProps) => {
  const direction = rest.inline ? 'row' : rest.direction || 'column';
  return <Flex ref={ref} {...rest} direction={direction} />;
});

const AnimatedStack = Animated.createAnimatedComponent(Stack);
AnimatedStack.displayName = 'AnimatedStack';
export { AnimatedStack };
Stack.displayName = 'Stack';
export default Stack;
