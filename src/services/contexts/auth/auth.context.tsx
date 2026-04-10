import React, { createContext, useMemo, useState } from 'react';
import type { AuthContextValue, AuthUser } from './auth.types';

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);


  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      setUser,
    }),
    [user, ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const Auth = {
  Context: AuthContext,
  Provider: AuthProvider,
} as const;
