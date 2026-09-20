import {
    expect,
    http,
    HttpResponse,
    test,
} from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { PagingDirection } from "@sside-net/constant";
import { StatusCodes } from "http-status-codes";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockSlugBlogEntryPage } from "./_test/mockSlugBlogEntryPage";

test.describe("NextBlogEntryLink", () => {
    const mockPageValue = mockValuePublicBlogEntryController_getBlogEntryBySlug;
    test.beforeEach(async ({ page, msw }) => {
        mockSlugBlogEntryPage(msw);
        await page.goto(`/blog/entry/${mockPageValue.slug}`);
    });

    test("次のページがある場合、リンクが表示されること。", async ({ page }) => {
        await expect(page.locator(".next-blog-entry-link")).toBeVisible();
    });

    test("次のページがない場合、リンクが表示されないこと。", async ({
        page,
        msw,
    }) => {
        const endpointUrl = new URL(
            getAppConfig().global.baseUrl.backend +
                `/blog-entry/latest/adjecent/${PagingDirection.Earlier}`,
        );
        endpointUrl.searchParams.set(
            "pointer-blog-entry-slug",
            mockPageValue.slug,
        );
        msw.use(
            http.get(
                endpointUrl.href,
                () =>
                    new HttpResponse(null, {
                        status: StatusCodes.NO_CONTENT,
                    }),
            ),
        );
        await page.reload();

        await expect(page.locator(".next-blog-entry-link")).not.toBeVisible();
    });
});
