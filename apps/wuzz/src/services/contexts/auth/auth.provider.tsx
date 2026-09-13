import React, { ReactNode, useCallback, useMemo, useState, useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import { AuthStateContext, AuthActionsContext, AuthUser } from './auth.context';

const storage = new MMKV();

const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth.accessToken',
  REFRESH_TOKEN: 'auth.refreshToken',
  USER: 'auth.user',
} as const;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from storage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedAccessToken = storage.getString(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        const storedRefreshToken = storage.getString(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        const storedUser = storage.getString(AUTH_STORAGE_KEYS.USER);

        if (storedAccessToken && storedRefreshToken && storedUser) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('[AuthProvider] Failed to load auth state:', error);
        // Clear corrupted data
        storage.delete(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        storage.delete(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        storage.delete(AUTH_STORAGE_KEYS.USER);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Actions - memoized with useCallback, NEVER change reference
  const login = useCallback(
    (newAccessToken: string, newRefreshToken: string, newUser: AuthUser) => {
      try {
        // Update state
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(newUser);

        // Persist to storage
        storage.set(AUTH_STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        storage.set(AUTH_STORAGE_KEYS.USER, JSON.stringify(newUser));

        console.log('[AuthProvider] User logged in:', newUser.username);
      } catch (error) {
        console.error('[AuthProvider] Failed to save auth state:', error);
      }
    },
    [] // Empty deps = stable function reference
  );

  const logout = useCallback(() => {
    try {
      // Clear state
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);

      // Clear storage
      storage.delete(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      storage.delete(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      storage.delete(AUTH_STORAGE_KEYS.USER);

      console.log('[AuthProvider] User logged out');
    } catch (error) {
      console.error('[AuthProvider] Failed to clear auth state:', error);
    }
  }, []); // Empty deps = stable function reference

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      try {
        const updatedUser = { ...prevUser, ...updates };
        storage.set(AUTH_STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        console.log('[AuthProvider] User updated');
        return updatedUser;
      } catch (error) {
        console.error('[AuthProvider] Failed to update user:', error);
        return prevUser;
      }
    });
  }, []); // Empty deps = stable function reference

  // State value - only re-renders when state actually changes
  const stateValue = useMemo(
    () => ({
      isAuthenticated: !!accessToken && !!user,
      user,
      accessToken,
      refreshToken,
      isLoading,
    }),
    [accessToken, refreshToken, user, isLoading]
  );

  // Actions value - NEVER changes, prevents re-renders for components that only need actions
  const actionsValue = useMemo(
    () => ({
      login,
      logout,
      updateUser,
    }),
    [login, logout, updateUser]
  );

  // Don't render children until auth state is loaded
  if (isLoading) {
    return null; // Or a splash screen component
  }

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

