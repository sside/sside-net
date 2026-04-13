import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockDefaultValues } from "../../../test/mockDefaultValues";

test.describe("BlogEntry", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

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
