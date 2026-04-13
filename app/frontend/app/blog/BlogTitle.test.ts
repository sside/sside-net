import { expect, test } from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { mockDefaultValues } from "../../test/mockDefaultValues";

test.describe("BlogTitle", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

        await page.goto("/blog");
    });

    test("タイトルが表示されていること。", async ({ page }) => {
        await expect(
            page.getByRole("heading", { name: getAppConfig().global.appName }),
        ).toBeVisible();
    });
});
