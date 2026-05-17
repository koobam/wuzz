import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  detailsStepBaseSchema,
  DetailsStepFormData,
  phoneStepSchema,
  emailStepSchema,
} from '@features/(auth)/register/schemas';
import { RegisterConfig } from '../config';
import { RootStackParamList } from '@navigation/root/root.types';
import { useRegisterMutation } from '@services/mutations';
import { Keyboard } from 'react-native';

export type RegisterFormData = DetailsStepFormData & {
  phone?: string;
  email?: string;
};

interface UseRegisterFormParams {
  config: RegisterConfig;
}

export const useRegisterForm = ({ config }: UseRegisterFormParams) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const registerMutation = useRegisterMutation();

  const registerSchema = useMemo(() => {

    if (config.verificationMethod === 'phone') {
      return detailsStepBaseSchema
        .extend({ phone: phoneStepSchema.shape.phone.optional() })

    } else {
      return detailsStepBaseSchema
        .extend({ email: emailStepSchema.shape.email.optional() })
    }
  }, [config.verificationMethod]);

  const defaultValues = useMemo(() => {
    const base = {
      fullName: '',
      username: '',
      birthDate: '',

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

  const { control, handleSubmit, formState, trigger, getValues, setError, clearErrors, watch } = form;
  const { errors, isSubmitting } = formState;

  const isLoading = isSubmitting || registerMutation.isPending;

  const onSubmit = useCallback(
    (data: RegisterFormData) => {
      registerMutation.mutate(
        {
          name: data.fullName,
          username: data.username,
          date_of_birth: data.birthDate,
          phone: config.verificationMethod === 'phone' ? data.phone : undefined,
          email: config.verificationMethod === 'email' ? data.email : undefined,
        },
        {
          onSuccess: () => {
            navigation.popToTop();
            Keyboard.dismiss();
            navigation.navigate('verification', { phone: data.phone });
          },
        }
      );
    },
    [config.verificationMethod, navigation, registerMutation]
  );

  return {
    control,
    errors,
    isLoading,
    trigger,
    getValues,
    watch,
    setError,
    clearErrors,
    handleSubmit,
    onSubmit,
  };
};

