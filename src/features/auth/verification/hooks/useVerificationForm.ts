import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpStepSchema, OTPStepFormData } from '@features/auth/register/schemas';

export const useVerificationForm = () => {
  const form = useForm<OTPStepFormData>({
    resolver: zodResolver(otpStepSchema),
    defaultValues: {
      otpCode: '',
    },
  });

  const { control, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
  };
};

