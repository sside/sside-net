import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockDefaultValues } from "../../test/mockDefaultValues";

test.describe("BlogMetaTag", () => {
    const { slug, metaTags } =
        mockValuePublicBlogEntryController_getBlogEntryBySlug;

    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

        await page.goto(`/blog/entry/${slug}`);
    });

    test("対象のメタタグにリンクが張れていること。", async ({ page }) => {
        for (const { name } of metaTags) {
            await expect(
                page.locator(`a.blog-meta-tag[href="/blog/meta-tag/${name}"]`),
            ).toBeVisible();
        }
    });
});
