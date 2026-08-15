import { expect, test } from "next/experimental/testmode/playwright/msw";
import { DateTimeFormat, formatDateByJst } from "@sside-net/date-time";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockSlugBlogEntryPage } from "./_test/mockSlugBlogEntryPage";

test.describe("AdjacentBlogEntryLink", () => {
    const mockValue = mockValuePublicBlogEntryController_getBlogEntryBySlug;

    test.beforeEach(async ({ page, msw }) => {
        mockSlugBlogEntryPage(msw);

        await page.goto(`/blog/entry/${mockValue.slug}`);
    });

    test("公開日がISO8601フォーマットで表示されていること。", async ({
        page,
    }) => {
        await expect(
            page
                .locator(".adjacent-blog-entry-link")
                .getByText(
                    formatDateByJst(
                        new Date(mockValue.publishAt),
                        DateTimeFormat.Iso8601WithoutMilliseconds,
                    ),
                ),
        ).toBeVisible();
    });
});
