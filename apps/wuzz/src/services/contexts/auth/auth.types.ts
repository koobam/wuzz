import { User } from "@core/api/auth/user.types";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

/** Read-only auth state (use with useAuthState to avoid re-renders from action refs). */
export type AuthState = Pick<
  AuthContextValue,
  'user' | 'isAuthenticated'
>;

/** Auth actions only (use with useAuthAction for stable refs). */
export type AuthAction = Pick<AuthContextValue, 'setUser'>;
