import { getAppConfig } from "@sside-net/app-config";
import { RequestHeaderName } from "@sside-net/constant";
import { StatusCodes } from "http-status-codes";
import { jwtDecode } from "jwt-decode";
import createFetchClient from "openapi-fetch";
import createTanstackClient from "openapi-react-query";
import { FrontendCookieKey } from "../../constant/cookie/FrontendCookieKey";
import { components, paths } from "../../generated/api-client/backend-schema";
import { createLogger } from "../logger/createLogger";

export const isErrorResponse = (response: Response): boolean =>
    response.status >= 400;

export const isNotFoundErrorResponse = (response: Response): boolean =>
    response.status === StatusCodes.NOT_FOUND;

export const is400sErrorResponse = (response: Response): boolean =>
    400 <= response.status && response.status <= 499;

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

const logger = createLogger("api-client(server side)");
apiClient.use({
    onRequest: async ({ request }): Promise<void> => {
        logger.debug("call api", {
            method: request.method,
            url: request.url,
        });
    },
});

const clientSideLogger = createLogger("api-client(client side)");
clientSideApiClient.use({
    onRequest: async ({ request }): Promise<void> => {
        if (!window) {
            return;
        }

        clientSideLogger.debug("call api", {
            method: request.method,
            url: request.url,
        });

        const [accessTokenItem, refreshTokenItem] = await Promise.all(
            [FrontendCookieKey.AccessToken, FrontendCookieKey.RefreshToken].map(
                async (cookieKey) =>
                    await (window as Window)?.cookieStore?.get(cookieKey),
            ),
        );

        let accessToken = accessTokenItem?.value ?? "access_token_not_found";
        if (accessTokenItem?.value) {
            const { exp } = jwtDecode(accessTokenItem.value);
            if (exp && exp * 1000 < Date.now() && refreshTokenItem?.value) {
                try {
                    const response = await fetch(
                        "/api/authentication/refresh",
                        {
                            method: "POST",
                            body: JSON.stringify({
                                refreshToken: refreshTokenItem.value,
                            } satisfies paths["/authentication/refresh"]["post"]["requestBody"]["content"]["application/json"]),
                        },
                    );

                    if (response.ok) {
                        accessToken = (
                            (await response.json()) as components["schemas"]["AuthenticationResponse"]
                        ).accessToken;
                    }
                } catch (_) {
                    /**
                     * トークンリフレッシュできない場合は以後のリクエスト時に認証エラーになるので握りつぶす。
                     */
                }
            }
        }

        request.headers.set(RequestHeaderName.Authentication, accessToken);
    },
});

const $apiClient = createTanstackClient(clientSideApiClient);
export { apiClient, $apiClient };
