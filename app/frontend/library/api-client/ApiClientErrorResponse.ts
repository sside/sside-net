export type ApiClientErrorResponse = {
    message: string;
    error: string;
    statusCode: number;
};

export const isApiClientErrorResponse = (
    errorResponse: unknown,
): errorResponse is ApiClientErrorResponse =>
    !!errorResponse &&
    typeof (errorResponse as ApiClientErrorResponse)?.message === "string" &&
    typeof (errorResponse as ApiClientErrorResponse)?.error === "string" &&
    typeof (errorResponse as ApiClientErrorResponse)?.statusCode === "number";
