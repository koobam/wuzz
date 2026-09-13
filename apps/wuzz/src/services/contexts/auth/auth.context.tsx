import React, { createContext, useEffect, useMemo, useState } from 'react';
import type { AuthContextValue } from './auth.types';
import { useFetchMe } from '@hooks/apis/user';
import { User } from '@core/api/auth/user.types';

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data here
  const userQuery = useFetchMe();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      setUser,
    }),
    [user],
  );

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.data, userQuery.isError]);

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
