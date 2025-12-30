import { expect, http, test } from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { paths } from "../../../generated/backend-schema";

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
        msw.use(
            http.get(
                getAppConfig().frontend.backend.baseUrl +
                    (`/public-blog-entry-meta-tag` satisfies keyof paths),
                () => Response.json(mockMetaTags),
            ),
        );

        await page.goto("/blog");
    });

    test("取得したメタタグ一覧を表示出来ていること。", async ({ page }) => {
        for (const { name } of mockMetaTags) {
            await expect(page.getByText(name)).toBeVisible();
        }
    });
});
