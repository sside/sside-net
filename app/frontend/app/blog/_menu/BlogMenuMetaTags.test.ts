import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockGetBackendRequest } from "../../../library/test/mockGetBackendRequest";

test.describe("BlogMenuMetaTags", () => {
    const mockMetaTags = [
        {
            id: 1,
            name: "foo",
            count: 1,
        },
        {
            id: 2,
            name: "bar",
            count: 2,
        },
        {
            id: 3,
            name: "baz",
            count: 20,
        },
    ];

    test.beforeEach(async ({ page, msw }) => {
        mockGetBackendRequest("/public-blog-entry-meta-tag", mockMetaTags, msw);

        await page.goto("/blog");
    });

    test("取得したメタタグ一覧を表示出来ていること。", async ({ page }) => {
        for (const { name } of mockMetaTags) {
            await expect(
                page
                    .locator(".blog-menu-meta-tags")
                    .locator(`a[href="/blog/meta-tag/${name}"]`),
            ).toBeVisible();
        }
    });
    test("取得したメタタグ数を表示出来ていること。", async ({ page }) => {
        for (const { count } of mockMetaTags) {
            await expect(
                page
                    .locator(".blog-menu-meta-tags")
                    .getByRole("link")
                    .getByText(count.toString(10), {
                        exact: true,
                    }),
            ).toBeVisible();
        }
    });
});
