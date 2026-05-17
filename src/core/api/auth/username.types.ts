import { ApiResponse } from '@core/http/response';

export interface UsernameSuggestionsParams {
  name: string;
  username?: string;
  birth_date?: string;
}


export type UsernameSuggestionsResponse = ApiResponse<string[]>;
export type CheckUsernameResponse = ApiResponse<null>;