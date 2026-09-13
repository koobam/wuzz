import request from '@http/request';
import { apiUrl } from '@http/url';
import type { CheckUsernameResponse, UsernameSuggestionsParams, UsernameSuggestionsResponse } from './username.types';

export const getUsernameSuggestions = (
  params: UsernameSuggestionsParams,
): Promise<UsernameSuggestionsResponse> =>
  request(apiUrl('/app/suggest-username'), {
    method: 'GET',
    params,
  });


export const checkUsernameAvailability = (username: string): Promise<CheckUsernameResponse> =>
  request(apiUrl('/app/check-username'), {
    method: 'GET',
    params: { username },
  })
