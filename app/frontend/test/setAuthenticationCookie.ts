import { getAppConfig } from "@sside-net/app-config";
import { Page } from "playwright";
import { FrontendCookieKey } from "../constant/cookie/FrontendCookieKey";

export const setAuthenticationCookie = async (page: Page): Promise<void> => {
    await page.context().addCookies([
        {
            name: FrontendCookieKey.RefreshToken,
            value: "",
            url: getAppConfig().global.baseUrl.frontend,
        },
    ]);

    return;
};
