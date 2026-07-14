import defu from "defu";
import { AppConfig } from "./AppConfig";
import { localAppConfig } from "./localAppConfig";

export const testAppConfig = defu(
    {
        frontend: {
            baseUrl: "http://localhost:42980",
        },
    },
    localAppConfig,
) satisfies AppConfig;
