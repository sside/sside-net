import { Page } from "@playwright/test";
import { getAppConfig } from "@sside-net/app-config";
import { paths } from "../../generated/backend-schema";

export const mockBackendRequest = async (
    page: Page,
    apiRoute: keyof paths | string,
    value: unknown,
) => {
    await page.route(
        getAppConfig().frontend.backend.baseUrl + apiRoute,
        async (route) =>
            route.fulfill({
                json: value,
            }),
    );
};
