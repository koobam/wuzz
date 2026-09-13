import { ApiResponse, ErrorResponse } from "@http/response";


export interface User {
  id: number
  name: string
  phone: string
  email: string
  streak: number
  point: number
  xp: number
  date_of_birth: string
  created_at: string
  updated_at: string
};

export type UserResponse = ApiResponse<User>;
export type UserErrorResponse = ErrorResponse<null>;