import React, { useState, useCallback, forwardRef } from 'react';
import { TextInput, View, TextInputProps, Pressable as RNPressable } from 'react-native';
import sv from 'style-variants';
import theme, { navigationTheme } from '../theme';
import { Text } from '../text';
import { Eye, EyeSlash } from 'iconsax-react-native';

const inputContainer = sv({
  base: {
    width: '100%',
  },
  variants: {
    spacing: {
      sm: {
        marginBottom: theme.spacing.small,
      },
      md: {
        marginBottom: theme.spacing.standard,
      },
      lg: {
        marginBottom: theme.spacing.large,
      },
      none: {
        marginBottom: 0,
      },
    },
  },
  defaultVariants: {
    spacing: 'none',
  },
});

const inputWrapper = sv({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  variants: {
    variant: {
      default: {
        backgroundColor: theme.pallate.neutral['02'],
        borderColor: theme.pallate.neutral['04'],
      },
      outline: {
        borderColor: theme.pallate.neutral['02'],
      },
      filled: {
        backgroundColor: theme.pallate.neutral['02'],
        borderColor: 'transparent',
      },
    },
    size: {
      sm: {
        height: 40,
        paddingHorizontal: theme.spacing.standard,
      },
      md: {
        height: 55,
        paddingHorizontal: theme.spacing.large,
      },
      lg: {
        height: 65,
        paddingHorizontal: theme.spacing.large,
      },
    },
    error: {
      true: {
        borderColor: theme.pallate.danger['03'],
      },
    },
    focused: {
      true: {
        borderColor: theme.pallate.primary['03'],
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
    rounded: {
      true: {
        borderRadius: 9999,
      },
      false: {
        borderRadius: 4,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    rounded: true,
  },
});

const inputText = sv({
  base: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: navigationTheme.fonts.regular.fontFamily,
    color: theme.pallate.neutral['05'],
  },
  variants: {
    size: {
      sm: {
        fontSize: 14,
      },
      md: {
        fontSize: 16,
      },
      lg: {
        fontSize: 18,
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
  inputStyle?: any;
  type?: 'text' | 'password' | 'email' | 'phone' | 'number';
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  spacing?: 'sm' | 'md' | 'lg' | 'none';
  disabled?: boolean;
  rounded?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    label,
    error,
    leftIcon,
    rightIcon,
    variant,
    size,
    spacing,
    disabled,
    rounded = true,
    containerStyle,
    inputStyle,
    type = 'text',
    onFocus,
    onBlur,
    ...textInputProps
  } = props;


  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  const isPassword = type === 'password';
  const shouldSecureText = isPassword && !isPasswordVisible;

  const keyboardType = type === 'email'
    ? 'email-address'
    : type === 'phone'
    ? 'phone-pad'
    : type === 'number'
    ? 'numeric'
    : 'default';

  const autoCapitalize = type === 'email' ? 'none' : 'sentences';

  const containerStyles = inputContainer({
    spacing,
    style: containerStyle,
  });

  const wrapperStyles = inputWrapper({
    variant,
    size,
    error: !!error,
    focused: isFocused,
    disabled,
    rounded,
  });

  const textStyles = inputText({
    size,
    style: inputStyle,
  });

  return (
    <View style={containerStyles}>
      {label && (
        <Text
          type="b2"
          weight="medium"
          color={theme.pallate.neutral['01']}
          style={{ marginBottom: theme.spacing.small }}
        >
          {label}
        </Text>
      )}
      <View style={wrapperStyles}>
        {leftIcon && (
          <View style={{ marginRight: theme.spacing.small }}>
            {leftIcon}
          </View>
        )}
        <TextInput
          ref={ref}
          style={textStyles}
          placeholderTextColor={theme.pallate.neutral['04']}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={shouldSecureText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...textInputProps}
        />
        {isPassword && (
          <RNPressable
            onPress={togglePasswordVisibility}
            style={{ marginLeft: theme.spacing.standard }}
          >
            {isPasswordVisible ? (
              <Eye size={20} color={theme.pallate.neutral['02']} />
            ) : (
              <EyeSlash size={20} color={theme.pallate.neutral['02']} />
            )}
          </RNPressable>
        )}
        {rightIcon && !isPassword && (
          <View style={{ marginLeft: theme.spacing.standard }}>
            {rightIcon}
          </View>
        )}
      </View>
      {typeof error === 'string' && error !== '' && (
        <Text
          type="l1"
          color={theme.pallate.danger['03']}
          style={{ marginTop: theme.spacing.small }}
        >
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;
export { DateInput } from './DateInput';
export type { DateInputProps, DateInputRef } from './DateInput';

