import { getAppConfig } from "@sside-net/app-config";
import { StatusCodes } from "http-status-codes";
import createClient from "openapi-fetch";
import { paths } from "../../generated/backend-schema";

export const isErrorResponse = (response: Response): boolean =>
    response.status >= 400;

export const isNotFoundErrorResponse = (response: Response): boolean =>
    response.status === StatusCodes.NOT_FOUND;

export const is400sErrorResponse = (response: Response): boolean =>
    400 <= response.status && response.status <= 499;

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
