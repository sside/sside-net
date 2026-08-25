import {
    expect,
    http,
    HttpResponse,
    test,
} from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { StringSearchParameterName } from "../../constant/search-parameter/StringSearchParameterName";
import { mockValuePublicBlogEntryController_getEarlier } from "../../test/mock/mockPublicBlogEntryController_getEarlier";
import { mockBlogRootPage } from "./_test/mockBlogRootPage";

test.describe("NextLatestBlogEntryLink", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockBlogRootPage(msw);

        await page.goto("/blog");
    });

    test("次のページがある場合リンクが表示されること。", async ({ page }) => {
        const locator = page.locator(".next-latest-blog-entry-link");
        await expect(
            locator.locator(
                `a[href="/blog?${StringSearchParameterName.PointerBlogEntrySlug}=${mockValuePublicBlogEntryController_getEarlier.slug}"]`,
            ),
        ).toBeVisible();
    });

    test("次のページがない場合、リンクが表示されないこと。", async ({
        page,
        msw,
    }) => {
        msw.use(
            http.get(
                getAppConfig().global.baseUrl.backend + `/blog-entry/earlier`,
                () =>
                    new HttpResponse(null, {
                        status: 204,
                    }),
            ),
        );

        await page.goto("/blog");
        await expect(
            page.locator(".next-latest-blog-entry-link"),
        ).not.toBeVisible();
    });
});
