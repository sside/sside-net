import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockValuePublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag } from "../../../test/mock/mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag";
import { mockDefaultValues } from "../../../test/mockDefaultValues";

test.describe("BlogMenuMetaTags", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

        await page.goto("/blog");
    });

    test("取得したメタタグ一覧を表示出来ていること。", async ({ page }) => {
        for (const {
            name,
        } of mockValuePublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag) {
            await expect(
                page
                    .locator(".blog-menu-meta-tags")
                    .locator(`a[href="/blog/meta-tag/${name}"]`),
            ).toBeVisible();
        }
    });
    test("取得したメタタグ数を表示出来ていること。", async ({ page }) => {
        for (const {
            count,
        } of mockValuePublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag) {
            await expect(
                page
                    .locator(".blog-menu-meta-tags")
                    .getByRole("link")
                    .getByText(count.toString(10), {
                        exact: true,
                    }),
            ).toBeVisible();
        }
    });
});
