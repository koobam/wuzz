import request from "@http/request";
import { apiUrl } from "@http/url";
import { VerifyOtpBodyParams, VerifyOtpResponse } from "./verify-otp.types";

export const verifyOtp = (data: VerifyOtpBodyParams): Promise<VerifyOtpResponse> =>
    request(apiUrl("app/verify-otp"), {
        method: "POST",
        data
    });
