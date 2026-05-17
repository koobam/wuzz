import { verifyOtp } from "@core/api/auth/verify-otp";
import { VerifyOtpBodyParams, VerifyOtpErrorResponse } from "@core/api/auth/verify-otp.types";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useVerifyOtpMutation = () => useMutation({
    mutationFn: (payload: VerifyOtpBodyParams) => verifyOtp(payload),
    onError: (error: VerifyOtpErrorResponse) => {
        Toast.show({ type: 'error', text1: error.message });
    }
});
