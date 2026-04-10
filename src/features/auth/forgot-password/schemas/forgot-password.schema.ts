import { z } from 'zod';

export const usernameStepSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters'),
});

export const otpVerifySchema = z.object({
  otpCode: z
    .string()
    .min(1, 'OTP code is required')
    .length(6, 'OTP code must be 6 digits')
    .regex(/^\d+$/, 'OTP code must contain only digits'),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type UsernameStepFormData = z.infer<typeof usernameStepSchema>;
export type OTPVerifyFormData = z.infer<typeof otpVerifySchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

