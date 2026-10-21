import request from '@http/request';
import { API_V1, apiUrl } from '@http/url';
import type { CheckUsernameResponse, UsernameSuggestionsParams, UsernameSuggestionsResponse } from './username.types';

export const getUsernameSuggestions = (
  params: UsernameSuggestionsParams,
): Promise<UsernameSuggestionsResponse> =>
  request(apiUrl(`${API_V1}/suggest-username`), {
    method: 'GET',
    params,
  });


export const checkUsernameAvailability = (username: string): Promise<CheckUsernameResponse> =>
  request(apiUrl(`${API_V1}/check-username`), {
    method: 'GET',
    params: { username },
  })
