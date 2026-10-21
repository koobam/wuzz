import request from "@http/request";
import { UserResponse } from "./user.types";
import { API_V1, apiUrl } from "@http/url";

export const getMeInformation = (): Promise<UserResponse> =>
    request(apiUrl(`${API_V1}/me`), {
        method: 'GET',
    });

