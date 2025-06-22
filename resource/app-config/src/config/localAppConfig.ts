import { AppConfig } from "./AppConfig";
import { baseAppConfig } from "./baseAppConfig";

export const localAppConfig = {
    ...baseAppConfig,
    global: {
        ...baseAppConfig.global,
        log: {
            level: "debug",
        },
    },
} satisfies AppConfig;
