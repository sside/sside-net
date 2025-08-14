import { describe, expect, test } from "@jest/globals";
import { EnvironmentType } from "@sside-net/constant";
import { localAppConfig } from "./config/localAppConfig";
import { productionAppConfig } from "./config/productionAppConfig";
import { testAppConfig } from "./config/testAppConfig";
import { getAppConfig } from "./index";

describe("getAppConfig", () => {
    const { Test, Local, Production } = EnvironmentType;

    test("環境種別に応じた設定が取得できること。", () => {
        process.env.APP_ENV = Test;
        expect(getAppConfig()).toBe(testAppConfig);

        expect(getAppConfig(Test)).toBe(testAppConfig);
        expect(getAppConfig(Local)).toBe(localAppConfig);
        expect(getAppConfig(Production)).toBe(productionAppConfig);
    });
});
