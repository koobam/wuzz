import type { Control } from 'react-hook-form';
import type { RegisterFormData } from '../../hooks';
import type { VerificationMethod } from '../../config';

export type StepFormStep = {
  id: string;
  title: string;
  subtitle: string;
};

export type StepFormProps = {
  item: StepFormStep;
  control: Control<RegisterFormData>;
  errors: Record<string, { message?: string } | undefined>;
  isLoading: boolean;
  checkPasswordsMatch: () => boolean;
  verificationMethod: VerificationMethod;
  isActive?: boolean;
};
