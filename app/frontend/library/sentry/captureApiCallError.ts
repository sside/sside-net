import { FC } from "react";
import { captureException } from "@sentry/nextjs";
import { is400sErrorResponse } from "../api-client/api-client";
import { createLogger } from "../logger/createLogger";

export const captureApiCallError = <T>(
    response: Response,
    componentOrContextName:
        | FC<T>
        | ((...arguments_: unknown[]) => never)
        | string,
): Response => {
    const clonedResponse = response.clone();
    if (!is400sErrorResponse(response)) {
        // Client Componentから呼ばれるケースを考慮して非同期を待たない。
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        clonedResponse.json().then((json) => {
            createLogger(
                typeof componentOrContextName === "string" ?
                    componentOrContextName
                :   componentOrContextName.name,
            ).error(
                "バックエンドAPIコールに失敗しました。",
                json as Record<string, unknown>,
            );
        });

        captureException(response);
    }

    return response;
};
