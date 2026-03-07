import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockSlugBlogEntryPage } from "../entry/[blogEntrySlug]/_test/mockSlugBlogEntryPage";

test.describe("BlogEntryMetaTags", () => {
    const mockValue = mockValuePublicBlogEntryController_getBlogEntryBySlug;
    test.beforeEach(async ({ page, msw }) => {
        mockSlugBlogEntryPage(msw);

        await page.goto(`/blog/entry/${mockValue.slug}`);
    });

    test("メタタグごとに/blog/entry/{slug}へのリンクがあること。", async ({
        page,
    }) => {
        for (const { name } of mockValue.metaTags) {
            await expect(
                page
                    .locator(".blog-entry-meta-tags")
                    .locator(`a[href="/blog/meta-tag/${name}"]`),
            ).toBeVisible();
        }
    });
});
