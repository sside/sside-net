import { FC } from "react";
import { captureException } from "@sentry/nextjs";
import { ProjectLogger } from "@sside-net/project-logger";
import { is400sErrorResponse } from "../api-client/api-client";

export const captureApiCallError = <T>(
    response: Response,
    componentOrContextName:
        | FC<T>
        | ((...arguments_: unknown[]) => unknown)
        | string,
): void => {
    if (!is400sErrorResponse(response)) {
        new ProjectLogger(
            typeof componentOrContextName === "string" ?
                componentOrContextName
            :   componentOrContextName.name,
        );
    }

    captureException(response);

    return;
};
