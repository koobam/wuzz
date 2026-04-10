import React, { memo } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Input, Text, theme } from '@components/atoms';
import { OTPStepFormData } from '@features/auth/register/schemas';

interface OTPInputProps {
  control: Control<OTPStepFormData>;
  errors: FieldErrors<OTPStepFormData>;
  isLoading: boolean;
}

export const OTPInput = memo(({ control, errors, isLoading }: OTPInputProps) => {
  return (
    <Controller
      control={control}
      name="otpCode"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          placeholder="Enter 6-digit code"
          value={value}
          leftIcon={
            <Text type="s3" weight="medium" color={theme.pallate.neutral['01']}>
              P -
            </Text>
          }
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors.otpCode?.message}
          type="number"
          editable={!isLoading}
          variant="filled"
          size="md"
          rounded
          spacing="none"
          maxLength={6}
          autoFocus
        />
      )}
    />
  );
});

OTPInput.displayName = 'OTPInput';

