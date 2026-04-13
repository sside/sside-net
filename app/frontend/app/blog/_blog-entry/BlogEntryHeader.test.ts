import { expect, test } from "next/experimental/testmode/playwright/msw";
import { DateTimeFormat, parseIso8601ToJst } from "@sside-net/date-time";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockBackendGetResponse } from "../../../test/mockBackendGetResponse";
import { mockDefaultValues } from "../../../test/mockDefaultValues";

test.describe("BlogEntryHeader", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

        await page.goto(
            `/blog/entry/${mockValuePublicBlogEntryController_getBlogEntryBySlug.slug}`,
        );
    });

    test("タイトルが表示されること。", async ({ page }) => {
        await expect(
            page.locator(".blog-entry-header").getByRole("heading", {
                name: mockValuePublicBlogEntryController_getBlogEntryBySlug.title,
            }),
        ).toBeVisible();
    });

    test("公開日が表示されること。", async ({ page }) => {
        await expect(
            page
                .locator(".blog-entry-header")
                .getByText(
                    `publish: ${parseIso8601ToJst(mockValuePublicBlogEntryController_getBlogEntryBySlug.publishAt).toFormat(DateTimeFormat.Iso8601WithoutMilliseconds)}`,
                ),
        ).toBeVisible();
    });

    test.describe("更新日", async () => {
        test("更新日がある場合は更新日を表示すること。", async ({ page }) => {
            await expect(
                page
                    .locator(".blog-entry-header")
                    .getByText(
                        `update: ${parseIso8601ToJst(mockValuePublicBlogEntryController_getBlogEntryBySlug.updatedAt).toFormat(DateTimeFormat.Iso8601WithoutMilliseconds)}`,
                    ),
            ).toBeVisible();
        });

        test("更新日がない場合は更新日を表示しないこと。", async ({
            page,
            msw,
        }) => {
            const { updatedAt: _, ...mockValue } =
                mockValuePublicBlogEntryController_getBlogEntryBySlug;
            mockBackendGetResponse(
                `/public-blog-entry/slug/${mockValue.slug}` as "/public-blog-entry/slug/{slug}",
                mockValue,
                msw,
            );
            await page.goto(`/blog/entry/${mockValue.slug}`);

            await expect(
                page.locator(".blog-entry-header").getByText("update:"),
            ).not.toBeVisible();
        });
    });
});
