import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockSlugBlogEntryPage } from "../entry/[blogEntrySlug]/_test/mockSlugBlogEntryPage";

test.describe("BlogEntry", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockSlugBlogEntryPage(msw);

        await page.goto(
            `/blog/entry/${mockValuePublicBlogEntryController_getBlogEntryBySlug.slug}`,
        );
    });

    test("BlogEntryのタイトルが表示出来ていること。", async ({ page }) => {
        await expect(
            page
                .locator(".blog-entry")
                .getByText(
                    mockValuePublicBlogEntryController_getBlogEntryBySlug.title,
                ),
        ).toBeVisible();
    });
});
