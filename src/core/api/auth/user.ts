import request from "@core/http/request";
import { UserResponse } from "./user.types";
import { apiUrl } from "@core/http/url";

export const getMeInformation = (): Promise<UserResponse> =>
    request(apiUrl('/app/me'), {
        method: 'GET',
    });

