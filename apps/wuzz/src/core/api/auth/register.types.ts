import { ApiResponse, ErrorResponse } from "@http/response";

export interface RegisterBodyParams {
    username: string;
    name: string;
    date_of_birth: string;
    phone?: string;
    email?: string;
}

export interface RegisterDataResponse {
    phone: string;
    expired_at: string;
}

export type RegisterResponse = ApiResponse<RegisterDataResponse>;

export type RegisterErrorResponse = ErrorResponse<RegisterBodyParams>;