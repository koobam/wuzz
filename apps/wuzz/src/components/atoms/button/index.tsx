import React from 'react';
import sv, { VariantProps } from 'style-variants';
import theme from '../theme';
import GesturePressable from '../gesture-pressable';
import { GesturePressableProps } from '../gesture-pressable/gesture-pressable.types';

const button = sv({
  base: {
    alignItems: 'center',
    borderRadius: 4,
    borderCurve: 'continuous',
    justifyContent: 'center',
  },
  variants: {
    size: {
      // All three are a fixed height, so a button is the same size wherever it
      // appears and no screen needs its own padding to look right.
      sm: {
        height: 34,
        paddingHorizontal: 16,
      },
      md: {
        paddingHorizontal: 22,
        height: 55,
      },
      lg: {
        height: 65,
        paddingHorizontal: 22,
      },
      fixed: {
        width: 45,
        height: 45,
      },
    },
    variant: {
      primary: {
        backgroundColor: theme.pallate.primary['03'],
      },
      secondary: {
        borderColor: theme.pallate.neutral['03'],
        borderWidth: 1,
      },
      default: {
        backgroundColor: theme.pallate.neutral['03'],
      },
      // Black, for a destructive or secondary action beside a heading.
      dark: {
        backgroundColor: theme.pallate.neutral['05'],
      },
      // White, for sitting on a dark surface.
      light: {
        backgroundColor: theme.pallate.neutral['01'],
      },
      outline: {
        borderColor: theme.pallate.neutral['03'],
        borderWidth: 1,
      },
      link: {},
    },
    rounded: {
      true: {
        borderRadius: 9999,
        borderCurve: 'continuous',
      },
    },
    disabled: {
      true: {
        opacity: 0.2,
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
    rounded: false,
  },
});

type ButtonVariantsProps = VariantProps<typeof button>;

type ButtonProps = ButtonVariantsProps & GesturePressableProps;

export const Button = React.memo((props: ButtonProps) => {
  const { disabled, variant, size, rounded, style } = props;

  const buttonStyles = button({
    size,
    variant,
    rounded,
    disabled,
    style,
  });

  return (
    <GesturePressable
      {...props}
      style={buttonStyles}
      items="center"
      justify="center"
    />
  );
});

export default Button;
