import React, { memo, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { VStack, Text, theme, Input } from '@components/atoms';
import { Dimensions, TextInput } from 'react-native';
import { RegisterFormData } from '../hooks';
import { getFieldConfig } from '../helpers';
import { VerificationMethod } from '../config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Step {
  id: string;
  title: string;
  subtitle: string;
}

interface StepFormProps {
  item: Step;
  control: any;
  errors: any;
  isLoading: boolean;
  checkPasswordsMatch: () => boolean;
  verificationMethod: VerificationMethod;
  isActive: boolean; // Whether this step is currently active
}

export const StepForm = memo(
  ({ item, control, errors, isLoading, checkPasswordsMatch, verificationMethod, isActive }: StepFormProps) => {
    const inputRef = useRef<TextInput>(null);

    // Auto-focus when step becomes active
    useEffect(() => {
      if (isActive && inputRef.current) {
        inputRef.current?.focus();
      }
    }, [isActive]);
    const fieldConfigs = getFieldConfig({ errors, checkPasswordsMatch, verificationMethod });
    const fieldConfig = fieldConfigs[item.id as keyof typeof fieldConfigs];

    if (!fieldConfig) return null;

    return (
      <VStack
        style={{
          width: SCREEN_WIDTH,
          paddingHorizontal: theme.spacing.large,
          paddingBottom: theme.spacing.large,
        }}
        gap={theme.spacing.large}
      >
        <VStack gap={theme.spacing.tiny}>
          <Text type="s1" weight="medium" color={theme.pallate.neutral['01']}>
            {item.title}
          </Text>
          <Text type="l1" color={theme.pallate.neutral['02']}>
            {item.subtitle}
          </Text>
        </VStack>

        <Controller
          control={control}
          name={item.id as keyof RegisterFormData}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState }) => {
            // Ensure value is always a string, never undefined
            const stringValue = value ?? '';
            
            // Get error from fieldState (always up-to-date and synced with this field)
            let errorMessage: string | undefined;
            
            if (item.id === 'confirmPassword') {
              // For confirmPassword, use custom validation function
              const errorFn = fieldConfig.error as ((value: string) => string | undefined) | string | undefined;
              const customError = typeof errorFn === 'function' ? errorFn(stringValue) : errorFn;
              // Use fieldState.error if exists, otherwise use custom validation
              errorMessage = fieldState.error?.message || customError;
            } else {
              // For other fields, get error directly from fieldState
              errorMessage = fieldState.error?.message;
            }

            // Extract error from fieldConfig to avoid spreading it
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { error, ...restFieldConfig } = fieldConfig;

            return (
              <Input
                ref={inputRef}
                value={stringValue}
                onChangeText={onChange}
                onBlur={onBlur}
                rounded
                spacing="none"
                editable={!isLoading}
                variant="filled"
                size="md"
                {...restFieldConfig}
                error={errorMessage}
              />
            );
          }}
        />
      </VStack>
    );
  },
);

StepForm.displayName = 'StepForm';

