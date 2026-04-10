import React, { memo } from 'react';
import { VStack, Text, theme } from '@components/atoms';
import { VerificationMethod } from '@core/api/verification.types';

interface VerificationHeaderProps {
  verificationMethod: VerificationMethod;
  displayText: string;
}

export const VerificationHeader = memo(
  ({ verificationMethod, displayText }: VerificationHeaderProps) => {
    return (
      <VStack gap={theme.spacing.tiny}>
        <Text type="h2" weight="medium" color={theme.pallate.neutral['01']}>
          {verificationMethod === 'email' ? 'Verify Your Email' : 'Verify Your Phone'}
        </Text>
        <Text type="b2" color={theme.pallate.neutral['02']}>
          We sent a verification code to {displayText}
        </Text>
      </VStack>
    );
  }
);

VerificationHeader.displayName = 'VerificationHeader';

