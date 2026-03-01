import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockValuePublicBlogEntryController_getBlogEntryArchiveYearMonths } from "../../../test/mock/mockPublicBlogEntryController_getBlogEntryArchiveYearMonths";
import { mockBlogRootPage } from "../_test/mockBlogRootPage";

test.describe("BlogMenuArchives", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockBlogRootPage(msw);

        await page.goto("/blog");
    });

    test("年度のリンクを表示出来ていること。", async ({ page }) => {
        for (const {
            year,
            month,
        } of mockValuePublicBlogEntryController_getBlogEntryArchiveYearMonths) {
            await expect(
                page.locator(
                    `.blog-menu-archives a[href="/blog/archive/${year}/${month}"]`,
                ),
            ).toBeVisible();
        }
    });
});
