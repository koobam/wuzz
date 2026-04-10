/**
 * Registration Configuration
 * 
 * This configuration can be controlled by:
 * 1. Backend API response (recommended)
 * 2. Environment variables
 * 3. Feature flags
 * 
 * Example: Fetch from backend on app initialization
 * const config = await fetch('/api/config/registration').then(r => r.json());
 * setRegistrationConfig(config);
 */

export type VerificationMethod = 'phone' | 'email';

export interface RegisterConfig {
  verificationMethod: VerificationMethod;
  requireVerification: boolean; // Whether verification step is required
}

// Default configuration - can be overridden by backend
// In production, this should come from backend API or feature flags
export const DEFAULT_REGISTER_CONFIG: RegisterConfig = {
  verificationMethod: 'email', // or 'email'
  requireVerification: true,
};

// Hook to get config from backend (you can implement this later)
// For now, we'll use the default config
export const getRegisterConfig = (): RegisterConfig => {
  // TODO: Fetch from backend API
  // const response = await api.get('/config/registration');
  // return response.data;
  
  // For now, return default config
  // You can also check environment variables or feature flags here
  return DEFAULT_REGISTER_CONFIG;
};

