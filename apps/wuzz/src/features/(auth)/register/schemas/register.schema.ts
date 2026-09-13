import { z } from 'zod';

export const phoneStepSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .min(10, 'Please enter a valid phone number')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  countryCode: z.string().default('+1'),
});

export const emailStepSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const otpStepSchema = z.object({
  otpCode: z
    .string()
    .min(1, 'OTP code is required')
    .length(6, 'OTP code must be 6 digits')
    .regex(/^\d+$/, 'OTP code must contain only digits'),
});

export const detailsStepBaseSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required', invalid_type_error: 'Full name is required' })
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  username: z
    .string({ required_error: 'Username is required', invalid_type_error: 'Username is required' })
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscore and dot'),
  birthDate: z
    .string({ required_error: 'Birth date is required', invalid_type_error: 'Birth date is required' })
    .min(1, 'Birth date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format')
    .refine((val) => !isNaN(Date.parse(val)), 'Please enter a valid date')
    .refine((val) => new Date(val) <= new Date(), 'Birth date cannot be in the future'),
});

export const detailsStepSchema = detailsStepBaseSchema;

export type PhoneStepFormData = z.infer<typeof phoneStepSchema>;
export type EmailStepFormData = z.infer<typeof emailStepSchema>;
export type OTPStepFormData = z.infer<typeof otpStepSchema>;
export type DetailsStepFormData = z.infer<typeof detailsStepSchema>;

