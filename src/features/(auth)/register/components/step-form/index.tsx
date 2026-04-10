import React, { memo, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { VStack, Text, theme, Input } from '@components/atoms';
import { Dimensions, TextInput } from 'react-native';
import type { RegisterFormData } from '../../hooks';
import { getFieldConfig } from '../../helpers';
import type { StepFormProps } from './step-form.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StepForm = memo(
  ({
    item,
    control,
    errors,
    isLoading,
    checkPasswordsMatch,
    verificationMethod,
    isActive,
  }: StepFormProps) => {
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      if (isActive && inputRef.current) {
        inputRef.current?.focus();
      }
    }, [isActive]);

    const fieldConfigs = getFieldConfig({
      errors,
      checkPasswordsMatch,
      verificationMethod,
    });
    const fieldConfig = fieldConfigs[item.id as keyof typeof fieldConfigs] as
      | Record<string, unknown>
      | undefined;

    if (!fieldConfig) return null;

    return (
      <VStack
        style={{
          width: SCREEN_WIDTH,
          paddingHorizontal: theme.spacing.large,
          paddingBottom: theme.spacing.large,
        }}
        spacing={theme.spacing.large}
      >
        <VStack spacing={theme.spacing.tiny}>
          <Text type="s1" weight="medium" color={theme.pallate.neutral['05']}>
            {item.title}
          </Text>
          <Text type="l1" color={theme.pallate.neutral['04']}>
            {item.subtitle}
          </Text>
        </VStack>

        <Controller
          control={control}
          name={item.id as keyof RegisterFormData}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState }) => {
            const stringValue = (value ?? '') as string;

            let errorMessage: string | undefined;
            if (item.id === 'confirmPassword') {
              const errorFn = fieldConfig.error as
                | ((value: string) => string | undefined)
                | string
                | undefined;
              const customError =
                typeof errorFn === 'function' ? errorFn(stringValue) : errorFn;
              errorMessage = fieldState.error?.message ?? customError;
            } else {
              errorMessage = fieldState.error?.message;
            }

            const { error: _error, ...restFieldConfig } = fieldConfig;

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
                {...(restFieldConfig as object)}
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
