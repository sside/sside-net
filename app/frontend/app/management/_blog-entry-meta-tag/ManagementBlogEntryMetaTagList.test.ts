import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockManagementRoot } from "../_test/mockManagementRoot";

test.describe("ManagementBlogEntryMetaTagList", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockManagementRoot(msw);

        await page.goto("/management");
    });

    test("", async ({ page }) => {
        await expect(
            page.locator(".management-blog-entry-meta-tag-list"),
        ).toBeVisible();
    });
});
