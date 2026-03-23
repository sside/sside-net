import defu from "defu";
import { AppConfig } from "./AppConfig";
import { baseAppConfig } from "./baseAppConfig";

export const localAppConfig = defu(baseAppConfig, {
    global: {
        log: {
            level: "debug",
        },
        baseUrl: {
            frontend: "http://localhost:42979",
            backend: "http://localhost:27250",
        },
    },
}) satisfies AppConfig;
