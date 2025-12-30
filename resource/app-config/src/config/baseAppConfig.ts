import { DeepPartial } from "utility-types";
import { AppConfig } from "./AppConfig";

export const baseAppConfig = {
    global: {
        appName: "sside.net",
        log: {
            level: "info",
        },
        sentry: {
            organizationName: "ssidenet",
        },
    },
    frontend: {
        sentry: {
            projectName: "sside-net-frontend",
        },
    },
    backend: {
        sentry: {
            projectName: "sside-net-backend",
        },
    },
} satisfies DeepPartial<AppConfig>;
