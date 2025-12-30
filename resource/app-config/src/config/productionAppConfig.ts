import defu from "defu";
import { AppConfig } from "./AppConfig";
import { baseAppConfig } from "./baseAppConfig";

export const productionAppConfig = defu(baseAppConfig, {
    frontend: {
        baseUrl: "https://sside.net",
        backend: {
            baseUrl: "https://api.sside.net",
        },
    },
}) satisfies AppConfig;
