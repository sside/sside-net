import {
    expect,
    http,
    HttpResponse,
    test,
} from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockSlugBlogEntryPage } from "./_test/mockSlugBlogEntryPage";

test.describe("PreviousBlogEntryLink", () => {
    const mockPageValue = mockValuePublicBlogEntryController_getBlogEntryBySlug;
    test.beforeEach(async ({ page, msw }) => {
        mockSlugBlogEntryPage(msw);
        await page.goto(`/blog/entry/${mockPageValue.slug}`);
    });

    test("前のページがある場合、リンクが表示されること。", async ({ page }) => {
        await expect(page.locator(".previous-blog-entry-link")).toBeVisible();
    });

    test("前のページがない場合、リンクが表示されないこと。", async ({
        page,
        msw,
    }) => {
        const endpointUrl = new URL(
            getAppConfig().global.baseUrl.backend + `/blog-entry/later`,
        );
        endpointUrl.searchParams.set(
            "pointer-blog-entry-id",
            mockPageValue.slug,
        );
        msw.use(
            http.get(
                endpointUrl.toString(),
                () =>
                    new HttpResponse(null, {
                        status: 204,
                    }),
            ),
        );
        await page.reload();

        await expect(
            page.locator(".previous-blog-entry-link"),
        ).not.toBeVisible();
    });
});
