import defu from "defu";
import { AppConfig } from "./AppConfig";
import { localAppConfig } from "./localAppConfig";

export const testAppConfig = defu(localAppConfig, {
    frontend: {
        baseUrl: "http://localhost:42980",
    },
}) satisfies AppConfig;
