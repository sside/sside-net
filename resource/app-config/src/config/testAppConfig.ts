import defu from "defu";
import { AppConfig } from "./AppConfig";
import { localAppConfig } from "./localAppConfig";

export const testAppConfig = defu(
    {
        global: {
            baseUrl: {
                frontend: "http://localhost:42980",
            },
        },
        frontend: {
            apiClient: {
                onErrorRetryCount: 0,
            },
        },
    },
    localAppConfig,
) satisfies AppConfig;
