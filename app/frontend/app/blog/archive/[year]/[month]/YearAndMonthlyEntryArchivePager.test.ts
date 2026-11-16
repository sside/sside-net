import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockBackendGetResponse } from "../../../../../test/mockBackendGetResponse";
import { mockDefaultValues } from "../../../../../test/mockDefaultValues";

test.describe("YearAndMonthlyEntryArchivePager", () => {
    test.beforeEach(async ({ msw }) => {
        mockDefaultValues(msw);
        mockBackendGetResponse(
            "/blog-entry/archive-year-month",
            [
                {
                    year: 2026,
                    month: 1,
                    count: 1,
                },
                {
                    year: 2025,
                    month: 3,
                    count: 1,
                },
                {
                    year: 2025,
                    month: 2,
                    count: 1,
                },
                {
                    year: 2025,
                    month: 1,
                    count: 1,
                },
                {
                    year: 2024,
                    month: 12,
                    count: 1,
                },
                {
                    year: 2024,
                    month: 6,
                    count: 1,
                },
                {
                    year: 2024,
                    month: 2,
                    count: 1,
                },
                {
                    year: 2023,
                    month: 12,
                    count: 1,
                },
            ],
            msw,
        );
    });

    test("前の月がある場合に表示できること。", async ({ page }) => {
        await page.goto("/blog/archive/2025/02");

        const locator = page.locator(".year-and-monthly-entry-archive-pager");
        const earlier = locator.getByRole("link", { name: "2025-01" });
        await expect(earlier).toBeVisible();
    });
    test("後の月がある場合に表示できること。", async ({ page }) => {
        await page.goto("/blog/archive/2025/02");

        const locator = page.locator(".year-and-monthly-entry-archive-pager");
        const later = locator.getByRole("link", { name: "2025-03" });
        await expect(later).toBeVisible();
    });
    test("隣接していないが前に月がある場合に表示できること。", async ({
        page,
    }) => {
        await page.goto("/blog/archive/2024/06");

        const locator = page.locator(".year-and-monthly-entry-archive-pager");
        const earlier = locator.getByRole("link", { name: "2024-02" });
        await expect(earlier).toBeVisible();
    });
    test("隣接していないが後に月がある場合に表示できること。", async ({
        page,
    }) => {
        await page.goto("/blog/archive/2024/06");

        const locator = page.locator(".year-and-monthly-entry-archive-pager");
        const earlier = locator.getByRole("link", { name: "2024-12" });
        await expect(earlier).toBeVisible();
    });
    test("前の月がない場合に表示しないこと。", async ({ page }) => {
        await page.goto("/blog/archive/2023/12");

        const locator = page.locator(".year-and-monthly-entry-archive-pager");
        const earlier = locator.getByRole("link", { name: "next" });
        await expect(earlier).not.toBeVisible();
    });
    test("後の月がない場合に表示しないこと。", async ({ page }) => {
        await page.goto("/blog/archive/2026/01");

        const locator = page.locator(".year-and-monthly-entry-archive-pager");
        const later = locator.getByRole("link", { name: "previous" });
        await expect(later).not.toBeVisible();
    });
});
