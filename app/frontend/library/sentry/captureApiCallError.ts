import { captureException } from "@sentry/nextjs";
import { createLogger } from "../logger/createLogger";

export const captureApiCallError = async (
    errorResponse: Response,
    componentOrContextName: string | { readonly name: string },
    ...additionalLogObjects: Record<string, unknown>[]
): Promise<void> => {
    const ERROR_MESSAGE = "バックエンドAPIコールに失敗しました。";
    const logger = createLogger(
        typeof componentOrContextName === "string" ?
            componentOrContextName
        :   componentOrContextName.name,
    );

    if (errorResponse.status < 500) {
        return;
    }

    errorResponse
        .clone()
        .json()
        // eslint-disable-next-line unicorn/prefer-await
        .then((json) => {
            logger.error(
                ERROR_MESSAGE,
                {
                    statusCode: errorResponse.status,
                    responseBody: json,
                },
                ...additionalLogObjects,
            );
        })
        // eslint-disable-next-line unicorn/prefer-await
        .catch(async () => {
            logger.error(
                ERROR_MESSAGE,
                {
                    text: await errorResponse.clone().text(),
                },
                ...additionalLogObjects,
            );
        });

    captureException(errorResponse);

    return;
};
