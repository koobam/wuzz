import request from "@http/request";
import { API_V1, apiUrl } from "@http/url";
import { VerifyOtpBodyParams, VerifyOtpResponse } from "./verify-otp.types";

export const verifyOtp = (data: VerifyOtpBodyParams): Promise<VerifyOtpResponse> =>
    request(apiUrl(`${API_V1}/verify-otp`), {
        method: "POST",
        data
    });
