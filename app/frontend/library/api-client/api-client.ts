import { getAppConfig } from "@sside-net/app-config";
import { StatusCodes } from "http-status-codes";
import createClient from "openapi-fetch";
import { paths } from "../../generated/backend-schema";

export const isErrorResponse = (error: unknown): error is ErrorResponse =>
    error instanceof ErrorResponse;

export const isNotFoundErrorResponse = (error: unknown): boolean =>
    isErrorResponse(error) && error.response.status === StatusCodes.NOT_FOUND;

export class ErrorResponse extends Error {
    constructor(public readonly response: Response) {
        super(response.statusText);
    }
}

const apiClient = createClient<paths>({
    baseUrl: getAppConfig().frontend.backend.baseUrl,
});

apiClient.use({
    onResponse: async ({ response }) => {
        if (!response.ok) {
            throw new ErrorResponse(response);
        }

        return;
    },
});

export { apiClient };
