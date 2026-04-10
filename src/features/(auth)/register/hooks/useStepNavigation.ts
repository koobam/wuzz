import { useCallback, useRef, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSharedValue } from 'react-native-reanimated';
import type { UseFormHandleSubmit } from 'react-hook-form';
import { RootStackParamList } from '@navigation/root/root.types';
import { goBackAfterInteractions } from '@navigation/service';
import { RegisterFormData } from './useRegisterForm';
import { RegisterConfig } from '../config';
import type { FlashListRef } from '@shopify/flash-list';

interface Step {
  id: string;
  title: string;
  subtitle: string;
}

const getSteps = (config: RegisterConfig): Step[] => {
  const baseSteps: Step[] = [
    {
      id: 'username',
      title: 'Pilih Username',
      subtitle:
        'Username unik untuk akun Wuzz-mu. Akan dipakai di wuzz.app/username.',
    },
    {
      id: 'fullName',
      title: 'Siapa Namamu?',
      subtitle: 'Nama yang akan tampil di profil.',
    },
    {
      id: 'password',
      title: 'Buat Password',
      subtitle: 'Minimal 6 karakter. Jangan bagikan ke siapapun.',
    },
    {
      id: 'confirmPassword',
      title: 'Konfirmasi Password',
      subtitle: 'Ketik ulang password yang sama.',
    },
  ];

  if (config.requireVerification) {
    if (config.verificationMethod === 'phone') {
      baseSteps.push({
        id: 'phone',
        title: 'Nomor Telepon',
        subtitle:
          'Untuk verifikasi dan pemulihan akun. Nomor yang valid.',
      });
    } else {
      baseSteps.push({
        id: 'email',
        title: 'Alamat Email',
        subtitle: 'Untuk verifikasi akun dan notifikasi penting.',
      });
    }
  }

  return baseSteps;
};

export interface UseStepNavigationParams {
  trigger: (field: keyof RegisterFormData) => Promise<boolean>;
  getValues: (field?: keyof RegisterFormData) => RegisterFormData;
  checkPasswordsMatch: () => boolean;
  handleSubmit: (
    onValid: (data: RegisterFormData) => void | Promise<void>,
    onInvalid?: (errors: unknown) => void,
  ) => (e?: unknown) => Promise<void>;
  onSubmit: (data: RegisterFormData) => void | Promise<void>;
  config: RegisterConfig;
}

export const useStepNavigation = ({
  trigger,
  getValues,
  checkPasswordsMatch,
  handleSubmit,
  onSubmit,
  config,
}: UseStepNavigationParams) => {
  const steps = useMemo(() => getSteps(config), [config]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const flashListRef = useRef<FlashListRef<Step> | null>(null);
  const scrollX = useSharedValue(0);
  const [currentStep, setCurrentStep] = useState(0);

  const validateCurrentStep = useCallback(async () => {
    const fieldToValidate = steps[currentStep].id as keyof RegisterFormData;

    if (fieldToValidate === 'confirmPassword') {
      const confirmVal = getValues('confirmPassword');
      if (!confirmVal) return false;
      if (!checkPasswordsMatch()) return false;
      return true;
    }

    return await trigger(fieldToValidate);
  }, [currentStep, steps, trigger, getValues, checkPasswordsMatch]);

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();

    if (!isValid) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      flashListRef.current?.scrollToIndex({
        index: currentStep + 1,
        animated: true,
      });
    } else {
      handleSubmit(onSubmit, () => {})();
    }
  }, [
    currentStep,
    steps.length,
    validateCurrentStep,
    handleSubmit,
    onSubmit,
  ]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      flashListRef.current?.scrollToIndex({
        index: currentStep - 1,
        animated: true,
      });
    } else {
      navigation.goBack();
    }
  }, [currentStep, navigation]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    currentStep,
    scrollX,
    flashListRef,
    handleNext,
    handleBack,
    handleClose,
    steps,
  };
};
