import request from "@http/request";
import { API_V1, apiUrl } from "@http/url";
import { RegisterBodyParams, RegisterResponse } from "./register.types";

export const register = (
    data: RegisterBodyParams,
): Promise<RegisterResponse> =>
    request(apiUrl(`${API_V1}/register`), {
        method: "POST",
        data
    });
