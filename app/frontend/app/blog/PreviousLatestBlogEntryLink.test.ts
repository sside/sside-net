import {
    expect,
    http,
    HttpResponse,
    test,
} from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { StringSearchParameterName } from "../../constant/search-parameter/StringSearchParameterName";
import { mockValuePublicBlogEntryController_getAdjacentLatestBlogEntries_Later } from "../../test/mock/mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Later";
import { mockBlogRootPage } from "./_test/mockBlogRootPage";

test.describe("PreviousLatestBlogEntryLink", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test.beforeEach(async ({ page, msw }) => {
        mockBlogRootPage(msw);

        await page.goto("/blog");
    });

    test("前のページがある場合リンクが表示されること。", async ({ page }) => {
        const locator = page.locator(".previous-latest-blog-entry-link");
        await expect(
            locator.locator(
                `a[href="/blog?${StringSearchParameterName.PointerBlogEntrySlug}=${mockValuePublicBlogEntryController_getAdjacentLatestBlogEntries_Later.slug}"]`,
            ),
        ).toBeVisible();
    });

    test("前のページがない場合、リンクが表示されないこと。", async ({
        page,
        msw,
    }) => {
        msw.use(
            http.get(
                getAppConfig().global.baseUrl.backend + `/blog-entry/later`,
                () =>
                    new HttpResponse(null, {
                        status: 204,
                    }),
            ),
        );

        await page.goto("/blog");
        await expect(
            page.locator(".previous-latest-blog-entry-link"),
        ).not.toBeVisible();
    });
});
