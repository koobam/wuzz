import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import {
  detailsStepSchema,
  DetailsStepFormData,
  phoneStepSchema,
  emailStepSchema,
} from '@features/(auth)/register/schemas';
import { z } from 'zod';
import { RegisterConfig } from '../config';
import { RootStackParamList } from '@navigation/root/root.types';
import { ROOT_ROUTES } from '@navigation/root/_routes';

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

  const registerSchema = useMemo(() => {
    const baseSchema = detailsStepSchema.extend({
      confirmPassword: z.string().optional(),
    });

    if (config.verificationMethod === 'phone') {
      return baseSchema.extend({
        phone: phoneStepSchema.shape.phone.optional(),
      });
    }
    return baseSchema.extend({
      email: emailStepSchema.shape.email.optional(),
    });
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
    }
    return { ...base, email: '' };
  }, [config.verificationMethod]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: 'onChange',
    shouldUnregister: false,
  });

  const { control, handleSubmit, formState, trigger, getValues } = form;
  const { errors, isSubmitting } = formState;

  const isLoading = isSubmitting;

  const checkPasswordsMatch = useCallback(() => {
    const password = getValues('password');
    const confirm = getValues('confirmPassword');
    return password === confirm && !!confirm;
  }, [getValues]);

  const onSubmit = useCallback(
    (_data: RegisterFormData) => {
      // TODO: call register API then navigate; or navigate to verification when screen exists
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ROOT_ROUTES.BOTTOM }],
        }),
      );
    },
    [navigation],
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
