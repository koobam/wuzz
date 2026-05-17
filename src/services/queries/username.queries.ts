import { createQueryKeys } from '@lukemorales/query-key-factory';
import { checkUsernameAvailability, getUsernameSuggestions } from '@core/api/auth/username';
import type { UsernameSuggestionsParams } from '@core/api/auth/username.types';

export const usernameQueries = createQueryKeys('username', {
  suggestions: (params: UsernameSuggestionsParams) => ({
    queryKey: [params.name, params.birth_date, params.username],
    queryFn: () => getUsernameSuggestions(params),
  }),
  availability: (username: string) => ({
    queryKey: ['checkUsernameAvailability', username],
    queryFn: () => checkUsernameAvailability(username),
  }),
});