import defu from "defu";
import { AppConfig } from "./AppConfig";
import { baseAppConfig } from "./baseAppConfig";
import { localAppConfig } from "./localAppConfig";

export const testAppConfig = defu(localAppConfig, baseAppConfig, {
    frontend: {
        baseUrl: "http://localhost:42980",
    },
}) satisfies AppConfig;
