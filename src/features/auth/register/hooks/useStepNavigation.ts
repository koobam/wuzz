import { useCallback, useRef, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSharedValue,  } from 'react-native-reanimated';
import { RootStackParamList } from '@navigation/root/root.types';
import { useHapticFeedback } from '@services/hooks/utils';
import { RegisterFormData } from './useRegisterForm';
import { RegisterConfig } from '../config';
import { FlatList } from 'react-native';

interface Step {
  id: string;
  title: string;
  subtitle: string;
}

const getSteps = (config: RegisterConfig): Step[] => {
  const baseSteps: Step[] = [
    {
      id: 'username',
      title: 'Choose Your Username',
      subtitle:
        'Claim your corner of Paperclip and get your own paplip.com/username. Pick something cool!',
    },
    {
      id: 'fullName',
      title: "What's Your Name?",
      subtitle:
        'Time to introduce yourself! This is what friends will see on your profile.',
    },
    {
      id: 'password',
      title: 'Create a Password',
      subtitle: 'Shhh... make it super secret! Only you should know this.',
    },
    {
      id: 'confirmPassword',
      title: 'Confirm That Password',
      subtitle: 'Just making sure you typed it right. You got this!',
    },
  ];

  // Add verification step based on config
  if (config.requireVerification) {
    if (config.verificationMethod === 'phone') {
      baseSteps.push({
        id: 'phone',
        title: 'Phone Number',
        subtitle:
          'Help us help you! For recovery & security (required for account recovery or security purposes).',
      });
    } else {
      baseSteps.push({
        id: 'email',
        title: 'Email Address',
        subtitle:
          "We'll use this to verify your account and send important updates.",
      });
    }
  }

  return baseSteps;
};

interface UseStepNavigationParams {
  trigger: (field: keyof RegisterFormData) => Promise<boolean>;
  getValues: (field?: keyof RegisterFormData) => any;
  checkPasswordsMatch: () => boolean;
  handleSubmit: (
    onValid: (data: RegisterFormData) => void | Promise<void>,
    onInvalid?: (errors: any) => void
  ) => (e?: any) => Promise<void>;
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
  const { triggerHaptic } = useHapticFeedback();
  const flatListRef = useRef<FlatList<any>>(null);
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
    triggerHaptic('light');

    const isValid = await validateCurrentStep();

    if (!isValid) {
      triggerHaptic('medium');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      flatListRef.current?.scrollToIndex({
        index: currentStep + 1,
        animated: true,
      });
    } else {
      // Final step - submit
      handleSubmit(
        onSubmit,
        (err) => {
          // Invalid form, trigger haptic (as extra safety/consistency)
          triggerHaptic('medium');
          console.log('invalid form', err);
        }
      )();
    }
  }, [
    triggerHaptic,
    currentStep,
    steps.length,
    validateCurrentStep,
    handleSubmit,
    onSubmit,
  ]);

  const handleBack = useCallback(() => {
    triggerHaptic('light');
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      flatListRef.current?.scrollToIndex({
        index: currentStep - 1,
        animated: true,
      });
    } else {
      navigation.goBack();
    }
  }, [currentStep, navigation, triggerHaptic]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    currentStep,
    scrollX,
    flatListRef,
    handleNext,
    handleBack,
    handleClose,
    steps,
  };
};

