import { expect, test } from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { mockBlogRootPage } from "./_test/mockBlogRootPage";

test.describe("BlogTitle", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockBlogRootPage(msw);

        await page.goto("/blog");
    });

    test("タイトルが表示されていること。", async ({ page }) => {
        await expect(
            page.getByRole("heading", { name: getAppConfig().global.appName }),
        ).toBeVisible();
    });
});
