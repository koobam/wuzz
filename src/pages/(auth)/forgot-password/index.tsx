import React, { memo, useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VStack, Text, theme, Input, Button, HStack, Flex } from '@components/atoms';
import { RootStackParamList } from '@navigation/root/root.types';
import { useHapticFeedback } from '@services/hooks/utils';
import {
  useForgotPasswordRequest,
  useForgotPasswordVerifyOTP,
  useForgotPasswordReset,
} from '@hooks/apis/auth';
import { TickCircle } from 'iconsax-react-native';
import {
  usernameStepSchema,
  UsernameStepFormData,
  otpVerifySchema,
  OTPVerifyFormData,
  resetPasswordSchema,
  ResetPasswordFormData,
} from '@features/auth/forgot-password/schemas';
import { PaperclipSvg } from '@assets/index';
import { IconX } from 'tabler-icons-react-native';

type ForgotPasswordStep = 'username' | 'otp' | 'reset' | 'success';

const ForgotPassword = memo(() => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { triggerHaptic } = useHapticFeedback();

  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>('username');
  const [username, setUsername] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [resetToken, setResetToken] = useState('');

  const requestMutation = useForgotPasswordRequest();
  const verifyOTPMutation = useForgotPasswordVerifyOTP();
  const resetMutation = useForgotPasswordReset();

  // Username step form
  const usernameForm = useForm<UsernameStepFormData>({
    resolver: zodResolver(usernameStepSchema),
    defaultValues: { username: '' },
  });

  // OTP step form
  const otpForm = useForm<OTPVerifyFormData>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { otpCode: '' },
  });

  // Reset password form
  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const handleUsernameSubmit = useCallback(
    async (data: UsernameStepFormData) => {
      triggerHaptic('light');

      try {
        const response = await requestMutation.mutateAsync(data);

        if (response.success && response.data) {
          setUsername(data.username);
          setMaskedPhone(response.data.phone);
          triggerHaptic('light');
          setCurrentStep('otp');
        }
      } catch {
        triggerHaptic('medium');
      }
    },
    [requestMutation, triggerHaptic]
  );

  const handleOTPSubmit = useCallback(
    async (data: OTPVerifyFormData) => {
      triggerHaptic('light');

      try {
        const response = await verifyOTPMutation.mutateAsync({
          username,
          code: data.otpCode,
        });

        if (response.success && response.data) {
          setResetToken(response.data.resetToken);
          triggerHaptic('light');
          setCurrentStep('reset');
        }
      } catch {
        triggerHaptic('medium');
      }
    },
    [username, verifyOTPMutation, triggerHaptic]
  );

  const handleResetSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      triggerHaptic('light');

      try {
        await resetMutation.mutateAsync({
          resetToken,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        });

        triggerHaptic('light');
        setCurrentStep('success');
      } catch {
        triggerHaptic('medium');
      }
    },
    [resetToken, resetMutation, triggerHaptic]
  );

  const handleGoToLogin = useCallback(() => {
    triggerHaptic('light');
    navigation.replace('login');
  }, [navigation, triggerHaptic]);

  const handleResendOTP = useCallback(() => {
    usernameForm.handleSubmit(handleUsernameSubmit)();
  }, [usernameForm, handleUsernameSubmit]);

  const handleClose = useCallback(() => {
    triggerHaptic('light');
    navigation.goBack();
  }, [navigation, triggerHaptic]);

  const isLoading =
    usernameForm.formState.isSubmitting ||
    otpForm.formState.isSubmitting ||
    resetForm.formState.isSubmitting ||
    requestMutation.isPending ||
    verifyOTPMutation.isPending ||
    resetMutation.isPending;

  const renderStep = () => {
    switch (currentStep) {
      case 'username':
        return (
          <VStack spacing={theme.spacing.standard}>
            <Controller
              control={usernameForm.control}
              name="username"
              render={({ field: { onChange, onBlur, value } }: { field: ControllerRenderProps<UsernameStepFormData, 'username'> }) => (
                <Input
                  placeholder="Username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={usernameForm.formState.errors.username?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  variant="filled"
                  size="lg"
                />
              )}
            />

            <Button
              variant="primary"
              size="lg"
              rounded
              onPress={() => usernameForm.handleSubmit(handleUsernameSubmit)}
              disabled={isLoading}
              style={{ marginTop: theme.spacing.standard }}
            >
              <Text type="b1" weight="bold" color={theme.pallate.neutral['06']}>
                {isLoading ? 'Finding account...' : 'Continue'}
              </Text>
            </Button>
          </VStack>
        );

      case 'otp':
        return (
          <VStack spacing={theme.spacing.standard}>
            <Text type="b2" color={theme.pallate.neutral['02']}>
              We sent a code to {maskedPhone}
            </Text>

            <Controller
              control={otpForm.control}
              name="otpCode"
              render={({ field: { onChange, onBlur, value } }: { field: ControllerRenderProps<OTPVerifyFormData, 'otpCode'> }) => (
                <Input
                  placeholder="Enter 6-digit code"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={otpForm.formState.errors.otpCode?.message}
                  type="number"
                  editable={!isLoading}
                  variant="filled"
                  size="lg"
                  maxLength={6}
                />
              )}
            />

            <Button
              variant="primary"
              size="lg"
              rounded
              onPress={() => otpForm.handleSubmit(handleOTPSubmit)}
              disabled={isLoading}
              style={{ marginTop: theme.spacing.standard }}
            >
              <Text type="b1" weight="bold" color={theme.pallate.neutral['06']}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Text>
            </Button>

            <Button variant="link" size="sm" onPress={handleResendOTP} disabled={isLoading}>
              <Text type="b2" color={theme.pallate.primary['03']}>
                Resend code
              </Text>
            </Button>
          </VStack>
        );

      case 'reset':
        return (
          <VStack spacing={theme.spacing.standard}>
            <Controller
              control={resetForm.control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }: { field: ControllerRenderProps<ResetPasswordFormData, 'newPassword'> }) => (
                <Input
                  placeholder="New password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={resetForm.formState.errors.newPassword?.message}
                  type="password"
                  editable={!isLoading}
                  variant="filled"
                  size="lg"
                />
              )}
            />

            <Controller
              control={resetForm.control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }: { field: ControllerRenderProps<ResetPasswordFormData, 'confirmPassword'> }) => (
                <Input
                  placeholder="Confirm password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={resetForm.formState.errors.confirmPassword?.message}
                  type="password"
                  editable={!isLoading}
                  variant="filled"
                  size="lg"
                />
              )}
            />

            <Button
              variant="primary"
              size="lg"
              rounded
              onPress={() => resetForm.handleSubmit(handleResetSubmit)}
              disabled={isLoading}
              style={{ marginTop: theme.spacing.standard }}
            >
              <Text type="b1" weight="bold" color={theme.pallate.neutral['06']}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Text>
            </Button>
          </VStack>
        );

      case 'success':
        return (
          <VStack items="center" spacing={theme.spacing.large}>
            <TickCircle size={80} color={theme.pallate.primary['03']} variant="Bold" />

            <VStack items="center" spacing={theme.spacing.small}>
              <Text type="h3" weight="bold" color={theme.pallate.neutral['01']}>
                Password Reset!
              </Text>
              <Text type="b1" color={theme.pallate.neutral['02']} style={styles.centeredText}>
                Your password has been reset successfully
              </Text>
            </VStack>

            <Button
              variant="primary"
              size="lg"
              rounded
              onPress={handleGoToLogin}
              style={styles.fullWidthButton}
            >
              <Text type="b1" weight="bold" color={theme.pallate.neutral['06']}>
                Continue to Login
              </Text>
            </Button>
          </VStack>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    {/* Divider */}
    <Flex self="center" width={40} height={7} borderRadius={4} backgroundColor={theme.pallate.neutral['05']} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <HStack items="center" justify="space-between">
          <PaperclipSvg />
          <Button variant="secondary" size="fixed" rounded onPress={handleClose}>
            <IconX size={20} color={theme.pallate.neutral['01']} />
          </Button>
        </HStack>
        <VStack spacing={theme.spacing.tiny}>
          <Text type="h2" weight="medium" color={theme.pallate.neutral['01']}>
            Forgot password?
          </Text>
          <Text type="b2" color={theme.pallate.neutral['02']}>
            Enter your username, and we'll help you reset your password.
          </Text>
        </VStack>
        {renderStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

ForgotPassword.displayName = 'ForgotPassword';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.pallate.neutral['06'],
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
  centeredText: {
    textAlign: 'center',
  },
  fullWidthButton: {
    width: '100%',
  },
});

export default ForgotPassword;

