import request from "@core/http/request";
import { apiUrl } from "@core/http/url";
import { RegisterBodyParams, RegisterResponse } from "./register.types";

export const register = (
    data: RegisterBodyParams,
): Promise<RegisterResponse> =>
    request(apiUrl("app/register"), {
        method: "POST",
        data
    });
