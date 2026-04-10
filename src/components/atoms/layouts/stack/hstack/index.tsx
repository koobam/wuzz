import React from 'react';
import Stack from '../stack';
import { StackProps } from '../stack.types';
import Reanimated from 'react-native-reanimated';

export interface HStackProps extends Omit<StackProps, 'inline' | 'direction'> {
  reverse?: boolean;
}

export const HStack = React.memo((props: HStackProps) => {
  const { reverse, ...rest } = props;
  return <Stack {...rest} direction={reverse ? 'row-reverse' : 'row'} />;
});

HStack.displayName = 'HStack';
export const HStackAnimated = Reanimated.createAnimatedComponent(HStack);
