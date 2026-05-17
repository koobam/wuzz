import request from "@core/http/request";
import { apiUrl } from "@core/http/url";
import { VerifyOtpBodyParams, VerifyOtpResponse } from "./verify-otp.types";

export const verifyOtp = (data: VerifyOtpBodyParams): Promise<VerifyOtpResponse> =>
    request(apiUrl("app/verify-otp"), {
        method: "POST",
        data
    });
