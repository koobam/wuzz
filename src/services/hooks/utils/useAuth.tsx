import type { AuthAction, AuthState } from '@services/contexts/auth';
import { Auth } from '@services/contexts/auth';
import { useContext } from 'react';

/** Returns read-only auth state. Use when you only need to read state. */
export const useAuthState = (): AuthState => {
  const context = useContext(Auth.Context);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
  };
};

/** Returns auth actions only. Stable refs, use when you only need to dispatch. */
export const useAuthAction = (): AuthAction => {
  const context = useContext(Auth.Context);
  if (!context) {
    throw new Error('useAuthAction must be used within an AuthProvider');
  }
  return {
    setUser: context.setUser,
  };
};
