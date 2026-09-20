import { getAppConfig } from "@sside-net/app-config";
import { RequestHeaderName } from "@sside-net/constant";
import { StatusCodes } from "http-status-codes";
import { jwtDecode, JwtPayload } from "jwt-decode";
import createFetchClient from "openapi-fetch";
import createTanstackClient from "openapi-react-query";
import { FrontendCookieKey } from "../../constant/cookie/FrontendCookieKey";
import { components, paths } from "../../generated/api-client/backend-schema";
import { createLogger } from "../logger/createLogger";
import { captureApiCallError } from "../sentry/captureApiCallError";

export const isErrorResponse = (response: Response): boolean =>
    response.status >= 400;

export const isNotFoundErrorResponse = (response: Response): boolean =>
    response.status === StatusCodes.NOT_FOUND;

export const is400sErrorResponse = (response: Response): boolean =>
    400 <= response.status && response.status <= 499;

export const isServerErrorResponse = (response: Response): boolean =>
    response.status >= 500;

const {
    global: {
        baseUrl: { backend: backendBaseUrl },
    },
} = getAppConfig();

const apiClient = createFetchClient<paths>({
    baseUrl: backendBaseUrl,
});
const clientSideApiClient = createFetchClient<paths>({
    baseUrl: backendBaseUrl,
});

const isAccessPrivateEndpoint = (accessUrl: string) =>
    accessUrl.startsWith(getAppConfig().global.baseUrl.backend + "/private");
const isExpiredAccessToken = (accessTokenJwt: string): boolean => {
    const { exp } = jwtDecode<JwtPayload>(accessTokenJwt);

    return !!exp && exp * 1000 < Date.now();
};
const refreshAccessToken = async (
    refreshToken: string,
): Promise<string | null> => {
    try {
        const response = await fetch("/api/authentication/refresh", {
            method: "POST",
            body: JSON.stringify({
                refreshToken,
            } satisfies paths["/authentication/refresh"]["post"]["requestBody"]["content"]["application/json"]),
        });

        return response.ok ?
                (
                    (await response.json()) as components["schemas"]["AuthenticationResponse"]
                ).accessToken
            :   null;
    } catch (_) {
        /**
         * トークンリフレッシュできない場合は以後のリクエスト時に認証エラーになるので握りつぶす。
         */
        return null;
    }
};

const logger = createLogger("api-client(server)");
apiClient.use({
    onRequest: async ({ request }): Promise<void> => {
        logger.debug("call api", {
            method: request.method,
            url: request.url,
        });
    },
    onResponse: async ({ response, request }) => {
        if (isServerErrorResponse(response)) {
            await captureApiCallError(response, "api-client(server)", {
                requestUrl: request.url,
            });
        }
    },
});

const clientSideLogger = createLogger("api-client(browser)");
clientSideApiClient.use({
    onRequest: async ({ request }): Promise<void> => {
        if (!window) {
            return;
        }

        clientSideLogger.debug("call api", {
            method: request.method,
            url: request.url,
        });

        if (!isAccessPrivateEndpoint(request.url)) {
            return;
        }

        const [accessTokenItem, refreshTokenItem] = await Promise.all(
            [FrontendCookieKey.AccessToken, FrontendCookieKey.RefreshToken].map(
                async (cookieKey) =>
                    await (window as Window)?.cookieStore?.get(cookieKey),
            ),
        );

        let accessToken: string | null = accessTokenItem?.value ?? null;
        if (!accessToken) {
            return;
        }

        if (isExpiredAccessToken(accessToken) && refreshTokenItem?.value) {
            accessToken = await refreshAccessToken(refreshTokenItem.value);
        }

        request.headers.set(
            RequestHeaderName.Authentication,
            accessToken ?? "invalid_access_token",
        );
    },
    onResponse: async ({ response, request }) => {
        if (response.status >= 500) {
            await captureApiCallError(response, "api-client(browser)", {
                requestUrl: request.url,
            });
        }
    },
});

const $apiClient = createTanstackClient(clientSideApiClient);
export { apiClient, $apiClient };
