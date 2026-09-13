import { register } from "@core/api/auth/register";
import { RegisterBodyParams, RegisterErrorResponse } from "@core/api/auth/register.types";
import { useMutation } from "@tanstack/react-query"
import Toast from "react-native-toast-message";

export const useRegisterMutation = () => useMutation({
    mutationFn: (payload: RegisterBodyParams) => register(payload),
    onError: (error: RegisterErrorResponse) => {
        Toast.show({ type: 'error', text1: error.message });
    }
});