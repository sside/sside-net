import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockValuePublicBlogEntryController_getLatestBlogEntries } from "../../../test/mock/mockPublicBlogEntryController_getLatestBlogEntries";
import { mockBlogRootPage } from "../_test/mockBlogRootPage";

test.describe("BlogMenuRecentEntries", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockBlogRootPage(msw);

        await page.goto("/blog");
    });

    test("BlogEntryのタイトルが表示されること。", async ({ page }) => {
        for (const {
            title,
        } of mockValuePublicBlogEntryController_getLatestBlogEntries.blogEntries) {
            await expect(
                page.locator(".blog-menu-recent-entries").getByText(title),
            ).toBeVisible();
        }
    });

    test("BlogEntryのSlugへ向けたリンクが表示されること。", async ({
        page,
    }) => {
        for (const {
            slug,
        } of mockValuePublicBlogEntryController_getLatestBlogEntries.blogEntries) {
            await expect(
                page.locator(
                    `.blog-menu-recent-entries a[href="/blog/entry/${slug}"]`,
                ),
            ).toBeVisible();
        }
    });
});
