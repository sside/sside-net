import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockValuePublicBlogEntryController_getLatestBlogEntries } from "../../../test/mock/mockPublicBlogEntryController_getLatestBlogEntries";
import { mockDefaultValues } from "../../../test/mockDefaultValues";

test.describe("RecentBlogEntries", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

        await page.goto("/blog");
    });

    test("バックエンドから取得した数のBlogEntryが表示されていること。", async ({
        page,
    }) => {
        await expect(page.locator(".blog-entry")).toHaveCount(
            mockValuePublicBlogEntryController_getLatestBlogEntries.blogEntries
                .length,
        );
    });
});
