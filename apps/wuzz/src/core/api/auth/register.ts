import request from "@http/request";
import { apiUrl } from "@http/url";
import { RegisterBodyParams, RegisterResponse } from "./register.types";

export const register = (
    data: RegisterBodyParams,
): Promise<RegisterResponse> =>
    request(apiUrl("app/register"), {
        method: "POST",
        data
    });
