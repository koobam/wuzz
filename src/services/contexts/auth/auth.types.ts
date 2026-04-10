export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
}

/** Read-only auth state (use with useAuthState to avoid re-renders from action refs). */
export type AuthState = Pick<
  AuthContextValue,
  'user' | 'isAuthenticated'
>;

/** Auth actions only (use with useAuthAction for stable refs). */
export type AuthAction = Pick<AuthContextValue, 'setUser'>;
