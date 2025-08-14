import { EnvironmentType } from "@sside-net/constant";
import { getEnvironmentType } from "@sside-net/utility";
import { AppConfig } from "./config/AppConfig";
import { localAppConfig } from "./config/localAppConfig";
import { productionAppConfig } from "./config/productionAppConfig";
import { testAppConfig } from "./config/testAppConfig";

export const getAppConfig = (environmentType?: string): AppConfig => {
    const { Production, Local, Test } = EnvironmentType;
    switch (getEnvironmentType(environmentType)) {
        case Production:
            return productionAppConfig;
        case Local:
            return localAppConfig;
        case Test:
            return testAppConfig;
        default:
            throw new Error(
                `未定義の環境種別です。environmentType: ${environmentType}`,
            );
    }
};
