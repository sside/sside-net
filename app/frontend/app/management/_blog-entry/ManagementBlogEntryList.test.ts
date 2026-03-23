import { expect } from "@playwright/test";
import { test } from "../../../library/test/clientTest";
import { mockValueBlogEntryController_getAllBlogEntries } from "../../../test/mock/mockBlogEntryController_getAllBlogEntries";
import { mockManagementRoot } from "../_test/mockManagementRoot";

test.describe("ManagementBlogEntryList", () => {
    test.beforeEach(async ({ page, network }) => {
        mockManagementRoot(network);

        await page.goto("/management");
        await page.waitForLoadState("networkidle");
    });

    test("BlogEntryの数だけ行を表示できていること。", async ({ page }) => {
        expect(
            await page.locator(".blog-entry-table").locator("tbody tr").count(),
        ).toBe(mockValueBlogEntryController_getAllBlogEntries.length);
    });
});
