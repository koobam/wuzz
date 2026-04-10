export type ApiResponse<T> = {
    data: T | null;
    message: string;
    success: boolean;
}

export type ErrorResponse<T> = ApiResponse<Partial<Record<keyof T, string>>>;

export interface Timestamp {
    seconds: number
    nanos: number
}

export type BaseListParams = {
    num: number;
    cursor?: string;
    search?: string;
}
