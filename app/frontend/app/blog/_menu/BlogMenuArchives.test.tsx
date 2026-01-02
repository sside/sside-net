import { expect, test } from "@playwright/test";

test.describe("BlogMenuArchives", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("", async ({ page }) => {
        await expect(page);
    });
});
