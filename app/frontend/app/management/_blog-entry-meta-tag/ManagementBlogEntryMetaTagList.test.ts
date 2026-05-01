import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockDefaultValues } from "../../../test/mockDefaultValues";

test.describe("ManagementBlogEntryMetaTagList", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

        await page.goto("/management");
    });

    test("", async ({ page }) => {
        await expect(
            page.locator(".management-blog-entry-meta-tag-list"),
        ).toBeVisible();
    });
});
