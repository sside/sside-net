import { expect, test } from "@playwright/test";

test.describe("BlogMenu", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/blog");
    });

    test("About this site", async ({ page }) => {
        await expect(page.getByText(/About this site/)).toBeVisible();
    });
});
