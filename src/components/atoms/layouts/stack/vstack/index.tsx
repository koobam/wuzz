import React from 'react';
import {StackProps} from '../stack.types';
import Stack from '../stack';
import Reanimated from 'react-native-reanimated';

export interface VStackProps extends Omit<StackProps, 'inline' | 'direction'> {
  reverse?: boolean;
}

export const VStack = React.memo((props: VStackProps) => {
    const {reverse, ...rest} = props;
    return (
      <Stack
        {...rest}
        direction={reverse ? 'column-reverse' : 'column'}
      />
    );
  });

VStack.displayName = 'VStack';
export const VStackAnimated = Reanimated.createAnimatedComponent(VStack);
