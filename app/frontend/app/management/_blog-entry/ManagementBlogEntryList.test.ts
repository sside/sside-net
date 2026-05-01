import { expect } from "@playwright/test";
import { test } from "../../../test/clientTest";
import { mockValueBlogEntryController_getAllBlogEntries } from "../../../test/mock/mockBlogEntryController_getAllBlogEntries";
import { mockDefaultValues } from "../../../test/mockDefaultValues";

test.describe("ManagementBlogEntryList", () => {
    test.beforeEach(async ({ page, network }) => {
        mockDefaultValues(network);

        await page.goto("/management");
        await page.waitForLoadState("networkidle");
    });

    test("BlogEntryの数だけ行を表示できていること。", async ({ page }) => {
        expect(
            await page.locator(".blog-entry-table").locator("tbody tr").count(),
        ).toBe(mockValueBlogEntryController_getAllBlogEntries.length);
    });

    test("それぞれのエントリの編集ページへリンクが張られていること。", async ({
        page,
    }) => {
        for (const { id } of mockValueBlogEntryController_getAllBlogEntries) {
            await expect(
                page
                    .locator(".blog-entry-table")
                    .locator(
                        `a[href="/management/blog-entry/${id.toString(10)}/edit"]`,
                    ),
            ).toBeVisible();
        }
    });
});
