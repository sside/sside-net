import { AppConfig } from "./AppConfig";
import { baseAppConfig } from "./baseAppConfig";

export const testAppConfig = {
    ...baseAppConfig,
    global: {
        ...baseAppConfig.global,
        log: {
            level: "debug",
        },
    },
} satisfies AppConfig;
