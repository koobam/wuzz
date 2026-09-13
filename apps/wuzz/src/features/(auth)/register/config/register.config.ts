export type VerificationMethod = 'phone' | 'email';

export interface RegisterConfig {
  verificationMethod: VerificationMethod;
  requireVerification: boolean;
}

export const DEFAULT_REGISTER_CONFIG: RegisterConfig = {
  verificationMethod: 'phone',
  requireVerification: true,
};

export const getRegisterConfig = (): RegisterConfig => {
  return DEFAULT_REGISTER_CONFIG;
};
