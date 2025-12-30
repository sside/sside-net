import defu from "defu";
import { AppConfig } from "./AppConfig";
import { baseAppConfig } from "./baseAppConfig";

export const localAppConfig = defu(
    {
        global: {
            log: {
                level: "debug",
            },
        },
        frontend: {
            baseUrl: "http://localhost:42979",
            backend: {
                baseUrl: "http://localhost:27250",
            },
        },
    },
    baseAppConfig,
) satisfies AppConfig;
