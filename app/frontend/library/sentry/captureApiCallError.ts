import { FC } from "react";
import { captureException } from "@sentry/nextjs";
import { ProjectLogger } from "@sside-net/project-logger";
import { isNotFoundErrorResponse } from "../api-client/api-client";

export const captureApiCallError = (
    error: unknown,
    componentOrContextName: FC | ((...args: unknown[]) => unknown) | string,
): void => {
    if (!isNotFoundErrorResponse(error)) {
        new ProjectLogger(
            typeof componentOrContextName === "string" ?
                componentOrContextName
            :   componentOrContextName.name,
        );
    }

    captureException(error);

    return;
};
