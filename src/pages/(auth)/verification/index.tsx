import React, { memo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  VStack,
  Text,
  theme,
  Button,
  HStack,
  Flex,
} from '@components/atoms';
import { PaperclipSvg } from '@assets/index';
import { IconX } from 'tabler-icons-react-native';
import { useVerificationForm, useVerificationLogic } from '@features/auth/verification/hooks';
import { OTPInput, VerificationHeader } from '@features/auth/verification/components';

const Verification = memo(() => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
  } = useVerificationForm();

  const {
    verificationMethod,
    displayText,
    isLoading,
    canResend,
    countdown,
    handleVerify,
    handleResendOTP,
    handleClose,
  } = useVerificationLogic();

  const isFormLoading = isSubmitting || isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Top Handle */}
      <Flex
        self="center"
        width={40}
        height={7}
        borderRadius={4}
        backgroundColor={theme.pallate.neutral['05']}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HStack items="center" justify="space-between">
          <PaperclipSvg />
          <Button
            variant="secondary"
            size="fixed"
            rounded
            onPress={handleClose}
          >
            <IconX size={20} color={theme.pallate.neutral['01']} />
          </Button>
        </HStack>

        {/* Title Section */}
        <VerificationHeader
          verificationMethod={verificationMethod}
          displayText={displayText}
        />

        {/* Form Section */}
        <VStack gap={theme.spacing.standard}>
          <OTPInput control={control} errors={errors} isLoading={isFormLoading} />

          {/* Verify Button */}
          <Button
            variant="primary"
            size="lg"
            rounded
            onPress={handleSubmit(handleVerify)}
            disabled={isFormLoading}
            style={{ marginTop: theme.spacing.standard }}
          >
            <Text type="b1" weight="bold" color={theme.pallate.neutral['06']}>
              {isFormLoading ? 'Verifying...' : 'Verify'}
            </Text>
          </Button>

          {/* Resend Code Button */}
          <Button
            variant="link"
            size="sm"
            onPress={handleResendOTP}
            disabled={!canResend || isFormLoading}
          >
            <Text
              type="b2"
              color={
                canResend && !isFormLoading
                  ? theme.pallate.primary['03']
                  : theme.pallate.neutral['03']
              }
            >
              {canResend ? 'Resend code' : `Resend code in ${countdown}s`}
            </Text>
          </Button>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

Verification.displayName = 'Verification';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.pallate.neutral['06'],
    paddingTop: theme.spacing.standard,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
});

export default Verification;

