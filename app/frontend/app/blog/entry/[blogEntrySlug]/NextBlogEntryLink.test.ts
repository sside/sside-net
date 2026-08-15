import { expect, test } from "next/experimental/testmode/playwright/msw";

test.describe("NextBlogEntryLink", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("", async ({ page }) => {
        await expect(page.locator(".next-blog-entry-link"));
    });
});
