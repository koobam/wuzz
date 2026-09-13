import request from "@http/request";
import { UserResponse } from "./user.types";
import { apiUrl } from "@http/url";

export const getMeInformation = (): Promise<UserResponse> =>
    request(apiUrl('/app/me'), {
        method: 'GET',
    });

