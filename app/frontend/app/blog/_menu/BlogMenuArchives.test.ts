import { expect, test } from "next/experimental/testmode/playwright/msw";
import { operations } from "../../../generated/backend-schema";
import { mockGetBackendRequest } from "../../../library/test/mockGetBackendRequest";

type GetBlogEntryArchiveYearMonthsResponse =
    operations["PublicBlogEntryController_getBlogEntryArchiveYearMonths"]["responses"]["200"]["content"]["application/json"];

test.describe("BlogMenuArchives", () => {
    const mockValues = [
        {
            year: 2021,
            month: 6,
            count: 4,
        },
        {
            year: 2025,
            month: 7,
            count: 1,
        },
        {
            year: 2022,
            month: 2,
            count: 1,
        },
        {
            year: 2022,
            month: 4,
            count: 2,
        },
        {
            year: 2021,
            month: 4,
            count: 2,
        },
        {
            year: 2025,
            month: 2,
            count: 1,
        },
        {
            year: 2021,
            month: 10,
            count: 2,
        },
    ] satisfies GetBlogEntryArchiveYearMonthsResponse;

    test.beforeEach(async ({ page, msw }) => {
        mockGetBackendRequest(
            "/public-blog-entry/archive-year-month",
            mockValues,
            msw,
        );

        await page.goto("/blog");
    });

    test("年度のリンクを表示出来ていること。", async ({ page }) => {
        for (const { year, month } of mockValues) {
            await expect(
                page.locator(
                    `.blog-menu-archives a[href="/blog/archive/${year}/${month}"]`,
                ),
            ).toBeVisible();
        }
    });
});
