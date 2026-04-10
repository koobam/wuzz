import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRegister } from '@hooks/apis/auth';
import {
  detailsStepSchema,
  DetailsStepFormData,
  phoneStepSchema,
  emailStepSchema,
} from '@features/auth/register/schemas';
import { z } from 'zod';
import { RegisterConfig } from '../config';
import { RootStackParamList } from '@navigation/root/root.types';

export type RegisterFormData = DetailsStepFormData & {
  confirmPassword?: string;
  phone?: string;
  email?: string;
};

interface UseRegisterFormParams {
  config: RegisterConfig;
}

export const useRegisterForm = ({ config }: UseRegisterFormParams) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const registerMutation = useRegister();

  // Create dynamic schema based on verification method
  const registerSchema = useMemo(() => {
    const baseSchema = detailsStepSchema.extend({
      confirmPassword: z.string().optional(),
    });

    if (config.verificationMethod === 'phone') {
      return baseSchema.extend({
        phone: phoneStepSchema.shape.phone.optional(),
      });
    } else {
      return baseSchema.extend({
        email: emailStepSchema.shape.email.optional(),
      });
    }
  }, [config.verificationMethod]);

  const defaultValues = useMemo(() => {
    const base = {
      fullName: '',
      username: '',
      password: '',
      confirmPassword: '',
    };

    if (config.verificationMethod === 'phone') {
      return { ...base, phone: '' };
    } else {
      return { ...base, email: '' };
    }
  }, [config.verificationMethod]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: 'onChange', // Validate on every change for real-time feedback
    shouldUnregister: false, // Keep field values even when Controllers unmount
  });

  const { control, handleSubmit, formState, trigger, getValues } = form;
  const { errors, isSubmitting } = formState;

  const isLoading = isSubmitting || registerMutation.isPending;

  const checkPasswordsMatch = useCallback(() => {
    const password = getValues('password');
    const confirm = getValues('confirmPassword');
    return password === confirm && !!confirm;
  }, [getValues]);

  const onSubmit = useCallback(
    (data: RegisterFormData) => {
      // Navigate to verification screen based on verification method
      if (config.verificationMethod === 'phone' && data.phone) {
        navigation.navigate('verification', {
          phone: parseInt(data.phone, 10),
          countryCode: 1,
          type: 'sms',
        });
      } else if (config.verificationMethod === 'email' && data.email) {
        navigation.navigate('verification', {
          email: data.email,
        });
      }
    },
    [config.verificationMethod, navigation]
  );

  return {
    control,
    errors,
    isLoading,
    trigger,
    getValues,
    handleSubmit,
    onSubmit,
    checkPasswordsMatch,
  };
};

