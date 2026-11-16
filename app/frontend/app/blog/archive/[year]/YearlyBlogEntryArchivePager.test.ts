import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockBackendGetResponse } from "../../../../test/mockBackendGetResponse";
import { mockDefaultValues } from "../../../../test/mockDefaultValues";

test.describe("YearlyBlogEntryArchivePager", () => {
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
                    month: 1,
                    count: 1,
                },
                {
                    year: 2025,
                    month: 2,
                    count: 1,
                },
                {
                    year: 2024,
                    month: 1,
                    count: 1,
                },
            ],
            msw,
        );
    });

    test("以前の年のエントリーがある場合は、その年へのリンクが張られていること。", async ({
        page,
    }) => {
        await page.goto("/blog/archive/2025");

        const locator = page.locator(".yearly-blog-entry-archive-pager");
        const link = locator.getByRole("link", {
            name: "next",
        });
        await expect(link).toBeVisible();
    });

    test("以前の年のエントリーがない場合は、その年へのリンクがないこと。", async ({
        page,
    }) => {
        await page.goto("/blog/archive/2024");

        const locator = page.locator(".yearly-blog-entry-archive-pager");
        const link = locator.getByRole("link", {
            name: "next",
        });
        await expect(link).not.toBeVisible();
    });

    test("以降の年のエントリーがある場合は、その年へのリンクが張られていること。", async ({
        page,
    }) => {
        await page.goto("/blog/archive/2025");

        const locator = page.locator(".yearly-blog-entry-archive-pager");
        const link = locator.getByRole("link", {
            name: "previous",
        });
        await expect(link).toBeVisible();
    });

    test("以降の年のエントリーがない場合は、その年へのリンクがないこと。", async ({
        page,
    }) => {
        await page.goto("/blog/archive/2026");

        const locator = page.locator(".yearly-blog-entry-archive-pager");
        const link = locator.getByRole("link", {
            name: "previous",
        });
        await expect(link).not.toBeVisible();
    });
});
