import { expect, http, test } from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { StatusCodes } from "http-status-codes";
import { setAuthenticationCookie } from "../../../test/setAuthenticationCookie";
import { mockManagementRoot } from "../_test/mockManagementRoot";

test.describe("BackendErrorDisplay", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockManagementRoot(msw);
        await setAuthenticationCookie(page);
        msw.use(
            http.get(
                getAppConfig().global.baseUrl.backend +
                    "/private/blog-entry-meta-tag",
                () =>
                    Response.json(
                        {
                            error: "Internal Server Error",
                            message: "error sample",
                            statusCode: 500,
                        },
                        {
                            status: StatusCodes.INTERNAL_SERVER_ERROR,
                        },
                    ),
            ),
        );

        await page.goto("/management");
        await page.waitForLoadState("networkidle");
    });

    test("バックエンドから返ってきたエラーの内容を表示できていること。", async ({
        page,
    }) => {
        await expect(
            page.locator(".backend-error-display").getByText("error sample"),
        ).toBeVisible();
    });
});
