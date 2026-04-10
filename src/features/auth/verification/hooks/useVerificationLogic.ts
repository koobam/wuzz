import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHapticFeedback } from '@services/hooks/utils';
import { useSendVerification, useCheckVerification } from '@hooks/apis/auth';
import { RootStackParamList } from '@navigation/root/root.types';
import { ChannelTypeDTO, VerificationMethod } from '@core/api/verification.types';
import { formatPhoneForDisplay, formatEmailForDisplay } from '../helpers';
import { OTPStepFormData } from '@features/auth/register/schemas';
import { storage, VERIFICATION_COUNTDOWN_STORAGE } from '@core/http/storage';

interface VerificationRouteParams {
  phone?: number;
  countryCode?: number;
  email?: string;
  type?: ChannelTypeDTO;
}

export const useVerificationLogic = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { triggerHaptic } = useHapticFeedback();

  const params = route.params as VerificationRouteParams | undefined;
  const phone = params?.phone;
  const countryCode = params?.countryCode || 1;
  const email = params?.email;
  const verificationType = params?.type || 'sms';

  // Determine verification method
  const verificationMethod: VerificationMethod = email ? 'email' : 'phone';

  // Initialize countdown from MMKV or default to 0
  const getInitialCountdown = (): number => {
    const storedEndTime = storage.getNumber(VERIFICATION_COUNTDOWN_STORAGE);
    if (!storedEndTime) return 0;
    
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((storedEndTime - now) / 1000));
    return remaining;
  };

  const [canResend, setCanResend] = useState(() => {
    const initialCountdown = getInitialCountdown();
    return initialCountdown === 0;
  });
  const [countdown, setCountdown] = useState(getInitialCountdown);

  const sendVerificationMutation = useSendVerification();
  const checkVerificationMutation = useCheckVerification();

  // Format display text
  const displayText =
    verificationMethod === 'email'
      ? formatEmailForDisplay(email || '')
      : formatPhoneForDisplay(phone || 0, countryCode);

  const isLoading =
    checkVerificationMutation.isPending || sendVerificationMutation.isPending;

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      storage.delete(VERIFICATION_COUNTDOWN_STORAGE);
      return;
    }

    const timer = setInterval(() => {
      const storedEndTime = storage.getNumber(VERIFICATION_COUNTDOWN_STORAGE);
      if (!storedEndTime) {
        setCountdown(0);
        setCanResend(true);
        return;
      }

      const now = Date.now();
      const remaining = Math.max(0, Math.floor((storedEndTime - now) / 1000));
      
      setCountdown(remaining);
      
      if (remaining === 0) {
        setCanResend(true);
        storage.delete(VERIFICATION_COUNTDOWN_STORAGE);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Send OTP on mount
  useEffect(() => {
    const sendOTP = async () => {
      try {
        const payload =
          verificationMethod === 'email'
            ? { email: email || '' }
            : { phone: phone || 0, countryCode, type: verificationType };

        const response = await sendVerificationMutation.mutateAsync(payload as any);

        if (response.success && response.data?.resendAt) {
          const endTime = Date.now() + 60000; // 60 seconds from now
          storage.set(VERIFICATION_COUNTDOWN_STORAGE, endTime);
          setCanResend(false);
          setCountdown(60);
        }
      } catch {
        // Error handling is done in the mutation hook
      }
    };

    if (
      (verificationMethod === 'email' && email) ||
      (verificationMethod === 'phone' && phone && countryCode)
    ) {
      sendOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleVerify = useCallback(
    async (data: OTPStepFormData) => {
      triggerHaptic('light');

      try {
        const payload =
          verificationMethod === 'email'
            ? { email: email || '', code: data.otpCode }
            : { phone: phone || 0, countryCode, code: data.otpCode };

        const response = await checkVerificationMutation.mutateAsync(payload as any);

        if (response.success) {
          // Clear countdown on successful verification
          storage.delete(VERIFICATION_COUNTDOWN_STORAGE);
          triggerHaptic('light');
          // Navigate to login or home after successful verification
          navigation.replace('login');
        }
      } catch {
        triggerHaptic('medium');
      }
    },
    [
      verificationMethod,
      email,
      phone,
      countryCode,
      checkVerificationMutation,
      navigation,
      triggerHaptic,
    ]
  );

  const handleResendOTP = useCallback(async () => {
    if (!canResend || isLoading) return;

    triggerHaptic('light');

    try {
      const payload =
        verificationMethod === 'email'
          ? { email: email || '' }
          : { phone: phone || 0, countryCode, type: verificationType };

      const response = await sendVerificationMutation.mutateAsync(payload as any);

      if (response.success && response.data?.resendAt) {
        const endTime = Date.now() + 60000; // 60 seconds from now
        storage.set(VERIFICATION_COUNTDOWN_STORAGE, endTime);
        setCanResend(false);
        setCountdown(60);
        triggerHaptic('light');
      }
    } catch {
      triggerHaptic('medium');
    }
  }, [
    verificationMethod,
    email,
    phone,
    countryCode,
    verificationType,
    canResend,
    isLoading,
    sendVerificationMutation,
    triggerHaptic,
  ]);

  const handleClose = useCallback(() => {
    triggerHaptic('light');
    navigation.goBack();
  }, [navigation, triggerHaptic]);

  return {
    verificationMethod,
    displayText,
    isLoading,
    canResend,
    countdown,
    handleVerify,
    handleResendOTP,
    handleClose,
  };
};

