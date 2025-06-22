import { AppConfig } from "./AppConfig";
import { baseAppConfig } from "./baseAppConfig";

export const productionAppConfig = {
    ...baseAppConfig,
} satisfies AppConfig;
