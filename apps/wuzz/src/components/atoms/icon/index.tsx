import React, { memo } from 'react';
import IcoMoon, { IconProps as IcoMoonProps } from 'react-icomoon';
import { Svg, Path } from 'react-native-svg';
import icoMoonConfig from '@icons/selection.json';
import { StyleProp, ViewStyle } from 'react-native';

interface IconProps extends Omit<IcoMoonProps, 'style'> {
  style?: StyleProp<ViewStyle>;
}
export const Icon = memo(({ style, ...props }: IconProps) => (
  <IcoMoon
    native
    style={style as any}
    SvgComponent={Svg}
    PathComponent={Path}
    iconSet={icoMoonConfig}
    {...props}
  />
));

Icon.displayName = 'Icon';
export default Icon;
