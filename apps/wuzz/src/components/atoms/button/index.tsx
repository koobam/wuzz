import React from 'react';
import sv, {VariantProps} from 'style-variants';
import theme from '../theme';
import GesturePressable from '../gesture-pressable';
import { GesturePressableProps } from '../gesture-pressable/gesture-pressable.types';

const button = sv({
  base: {
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
  },
  variants: {
    size: {
      sm: {
        paddingVertical: 10,
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
      outline: {
        borderColor: theme.pallate.neutral['03'],
        borderWidth: 1,
      },
      link: {},
    },
    rounded: {
      true: {
        borderRadius: 9999,
      },
    },
    disabled: {
      true: {
        opacity: 0.2,
      },
    }
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
  const {disabled, variant, size, rounded, style} = props;

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
