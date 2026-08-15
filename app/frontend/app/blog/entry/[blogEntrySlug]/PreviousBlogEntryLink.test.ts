import { expect, test } from "next/experimental/testmode/playwright/msw";

test.describe("PreviousBlogEntryLink", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("", async ({ page }) => {
        await expect(page.locator(".previous-blog-entry-link"));
    });
});
