import React, {Ref} from 'react';
import {useMemo} from 'react';
import Box, {BoxProps} from '../box';
import {FlexStyle, View} from 'react-native';
import Reanimated from 'react-native-reanimated';

export interface FlexProps extends BoxProps {
  ref?: Ref<View>;
  fill?: boolean;
  wrap?: boolean;
  inline?: boolean;
  zIndex?: FlexStyle['zIndex'];
  content?: FlexStyle['alignContent'];
  self?: FlexStyle['alignSelf'];
  items?: FlexStyle['alignItems'];
  justify?: FlexStyle['justifyContent'];
  direction?: FlexStyle['flexDirection'];
}

export const Flex = React.memo((props: FlexProps) => {
    const {
      fill,
      wrap,
      inline,
      direction = 'row',
      justify,
      self,
      items,
      content,
      zIndex,
      style,
      ref,
      ...rest
    } = props;

    const flex: FlexStyle['flex'] = useMemo(
      () => (fill ? 1 : undefined),
      [fill],
    );

    const flexWrap: FlexStyle['flexWrap'] = useMemo(
      () => (wrap ? 'wrap' : undefined),
      [wrap],
    );

    const flexDirection = useMemo(
      () => (inline ? 'row' : direction || 'column'),
      [direction, inline],
    );

    const flexStyle = useMemo(() => {
      return {
        flex,
        flexWrap,
        flexDirection,
        zIndex,
        alignContent: content,
        justifyContent: justify,
        alignSelf: self,
        alignItems: items,
      };
    }, [flex, content, zIndex, flexWrap, flexDirection, justify, self, items]);

    return <Box ref={ref} style={[flexStyle, style]} {...rest} />;
  });

Flex.displayName = 'Flex';
export const FlexAnimated = Reanimated.createAnimatedComponent(Flex);
export default Flex;
