import { expect, test } from "@playwright/test";
import { getAppConfig } from "@sside-net/app-config";

test.describe("BlogTitle", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/blog");
    });

    test("タイトルが表示されていること。", async ({ page }) => {
        await expect(
            page.getByRole("heading", { name: getAppConfig().global.appName }),
        ).toBeVisible();
    });
});
