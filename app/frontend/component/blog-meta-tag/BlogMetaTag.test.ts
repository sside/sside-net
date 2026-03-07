import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockBlogRootPage } from "../../app/blog/_test/mockBlogRootPage";
import { mockValuePublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag } from "../../test/mock/mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag";

test.describe("BlogMetaTag", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockBlogRootPage(msw);

        await page.goto("/blog");
    });

    test("対象のメタタグにリンクが張れていること。", async ({ page }) => {
        const mockValue =
            mockValuePublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag.at(
                0,
            )!;
        await expect(
            page.locator(".blog-meta-tag").getByRole("link", {
                name: mockValue.name,
            }),
        ).toHaveAttribute("href", `/blog/meta-tag/${mockValue.name}`);
    });
});
