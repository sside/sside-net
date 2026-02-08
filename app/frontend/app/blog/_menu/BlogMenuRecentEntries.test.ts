import { expect, test } from "next/experimental/testmode/playwright/msw";
import { fakerEN, fakerJA } from "@faker-js/faker";
import { MarkdownSample1984 } from "@sside-net/constant";
import { createIntegerRange } from "@sside-net/utility";
import { operations } from "../../../generated/backend-schema";
import { mockGetBackendRequest } from "../../../library/test/mockGetBackendRequest";

type GetLatestBlogEntriesResponse =
    operations["PublicBlogEntryController_getLatestBlogEntries"]["responses"]["200"]["content"]["application/json"];

test.describe("BlogMenuRecentEntries", () => {
    const mockValue = {
        blogEntries: createIntegerRange(1, 3)
            .map((id): GetLatestBlogEntriesResponse["blogEntries"][0] => ({
                id,
                bodyMarkdown: MarkdownSample1984,
                title: fakerJA.book.title(),
                slug: fakerEN.lorem.slug(1),
                publishAt: fakerEN.date.past().toISOString(),
                metaTags: [],
                createdAt: fakerEN.date.past().toISOString(),
                updatedAt: fakerEN.date.past().toISOString(),
            }))
            .toSorted(({ publishAt: aPublishAt }, { publishAt: bPublishAt }) =>
                bPublishAt < aPublishAt ? -1 : 1,
            ),
    } satisfies GetLatestBlogEntriesResponse;

    test.beforeEach(async ({ page, msw }) => {
        mockGetBackendRequest("/public-blog-entry/latest", mockValue, msw);

        await page.goto("/blog");
    });

    test("BlogEntryのタイトルが表示されること。", async ({ page }) => {
        for (const { title } of mockValue.blogEntries) {
            await expect(
                page.locator(".blog-menu-recent-entries").getByText(title),
            ).toBeVisible();
        }
    });

    test("BlogEntryのSlugへ向けたリンクが表示されること。", async ({
        page,
    }) => {
        for (const { slug } of mockValue.blogEntries) {
            await expect(
                page.locator(
                    `.blog-menu-recent-entries a[href="/blog/entry/${slug}"]`,
                ),
            ).toBeVisible();
        }
    });
});
