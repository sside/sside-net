import { getAppConfig } from "@sside-net/app-config";
import { ProjectLogger } from "@sside-net/project-logger";
import { StatusCodes } from "http-status-codes";
import createFetchClient from "openapi-fetch";
import createTanstackClient from "openapi-react-query";
import { paths } from "./backend-schema";

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

const apiClient = createFetchClient<paths>({
    baseUrl: getAppConfig().global.baseUrl.backend,
});

const logger = new ProjectLogger("api-client");
apiClient.use({
    onRequest: ({ request }) => {
        logger.debug("request url", {
            url: request.url,
        });
    },
});

const $apiClient = createTanstackClient(apiClient);
export { apiClient, $apiClient };
