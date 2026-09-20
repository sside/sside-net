import {
    expect,
    http,
    HttpResponse,
    test,
} from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { PagingDirection } from "@sside-net/constant";
import { StatusCodes } from "http-status-codes";
import { mockDefaultValues } from "../../test/mockDefaultValues";

test.describe("LatestBlogEntryPager", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

        await page.goto("/blog");
    });

    test("先(過去)のコンテンツがある場合にリンクが表示されること。", async ({
        page,
    }) => {
        await expect(
            page.locator(".next-latest-blog-entry-link"),
        ).toBeVisible();
    });
    test("先(過去)のコンテンツがない場合はリンクが表示されないこと。", async ({
        page,
        msw,
    }) => {
        const endpointUrl = new URL(
            getAppConfig().global.baseUrl.backend +
                `/blog-entry/latest/adjecent/${PagingDirection.Earlier}`,
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
        await page.goto("/blog");

        await expect(
            page.locator(".next-latest-blog-entry-link"),
        ).not.toBeVisible();
    });

    test("前(未来)のコンテンツがある場合にリンクが表示されること。", async ({
        page,
    }) => {
        await expect(
            page.locator(".previous-latest-blog-entry-link"),
        ).toBeVisible();
    });
    test("前(未来)のコンテンツがない場合はリンクが表示されないこと。", async ({
        page,
        msw,
    }) => {
        const endpointUrl = new URL(
            getAppConfig().global.baseUrl.backend +
                `/blog-entry/latest/adjecent/${PagingDirection.Later}`,
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
        await page.goto("/blog");

        await expect(
            page.locator(".previous-latest-blog-entry-link"),
        ).not.toBeVisible();
    });
});
