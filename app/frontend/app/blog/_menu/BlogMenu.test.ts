import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockBlogRootPage } from "../_test/mockBlogRootPage";

test.describe("BlogMenu", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockBlogRootPage(msw);

        await page.goto("/blog");
    });

    test("About this site", async ({ page }) => {
        await expect(page.getByText(/About this site/)).toBeVisible();
    });
});
