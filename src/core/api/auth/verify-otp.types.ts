import { ApiResponse, ErrorResponse } from "@core/http/response";

export interface VerifyOtpBodyParams {
    phone: string;
    otp_code: string;
}

export interface VerifyOtpUser {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
}

export interface VerifyOtpDataResponse {
    user: VerifyOtpUser;
    access_token: string;
    refresh_token: string;
    expires_at: string;
}

export type VerifyOtpResponse = ApiResponse<VerifyOtpDataResponse>;
export type VerifyOtpErrorResponse = ErrorResponse<VerifyOtpBodyParams>;
