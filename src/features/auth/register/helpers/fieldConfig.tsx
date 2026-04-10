import React from 'react';
import { theme, Text, Flex, Pressable } from '@components/atoms';
import { IconChevronDown } from 'tabler-icons-react-native';
import { FieldErrors } from 'react-hook-form';
import { RegisterFormData } from '../hooks';
import { VerificationMethod } from '../config';

interface GetFieldConfigParams {
  errors: FieldErrors<RegisterFormData>;
  checkPasswordsMatch: () => boolean;
  verificationMethod: VerificationMethod;
}

export const getFieldConfig = ({
  errors,
  checkPasswordsMatch,
  verificationMethod,
}: GetFieldConfigParams) => {
  const baseConfigs: Record<string, any> = {
    username: {
      placeholder: 'username',
      leftIcon: (
        <Text type="b2" color={theme.pallate.neutral['01']} weight="medium">
          paplip.com/
        </Text>
      ),
      autoCapitalize: 'none' as const,
      autoCorrect: false,
      error: errors.username?.message,
    },
    password: {
      placeholder: 'Password',
      type: 'password' as const,
      error: errors.password?.message,
    },
    confirmPassword: {
      placeholder: 'Confirm Password',
      type: 'password' as const,
      error: (value: string) =>
        value
          ? checkPasswordsMatch()
            ? undefined
            : 'Passwords do not match'
          : 'Please confirm your password',
    },
    fullName: {
      placeholder: 'Full Name',
      autoCapitalize: 'words' as const,
      autoCorrect: false,
      error: errors.fullName?.message,
    },
  };

  // Dynamic verification field based on backend config
  const verificationConfig =
    verificationMethod === 'phone'
      ? {
          phone: {
            placeholder: 'e.g. 5551234567',
            autoCapitalize: 'none' as const,
            leftIcon: (
              <Pressable items="center" justify="center" gap={theme.spacing.small}>
                <Flex
                  borderRadius={10}
                  width={20}
                  height={20}
                  backgroundColor={theme.pallate.neutral['01']}
                />
                <Text type="b2" color={theme.pallate.neutral['01']} weight="medium">
                  +1
                </Text>
                <IconChevronDown size={14} color={theme.pallate.neutral['01']} />
              </Pressable>
            ),
            keyboardType: 'phone-pad' as const,
            error: errors.phone?.message,
          },
        }
      : {
          email: {
            placeholder: 'e.g. john@example.com',
            autoCapitalize: 'none' as const,
            autoCorrect: false,
            keyboardType: 'email-address' as const,
            error: errors.email?.message,
          },
        };

  return {
    ...baseConfigs,
    ...verificationConfig,
  };
};

