import defu from "defu";
import { AppConfig } from "./AppConfig";
import { baseAppConfig } from "./baseAppConfig";

export const productionAppConfig = defu(baseAppConfig, {
    global: {
        log: {
            level: "debug",
        },
        baseUrl: {
            frontend: "http://localhost:42979",
            backend: "http://localhost:27250",
        },
    },
    frontend: {
        baseUrl: "https://sside.net",
        backend: {
            baseUrl: "https://api.sside.net",
        },
    },
}) satisfies AppConfig;
