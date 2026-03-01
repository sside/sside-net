import { expect, test } from "next/experimental/testmode/playwright/msw";
import { createIntegerRange } from "@sside-net/utility";
import dedent from "dedent";
import { mockGetBackendRequest } from "../../../library/test/mockGetBackendRequest";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockSlugBlogEntryPage } from "../entry/[blogEntrySlug]/_test/mockSlugBlogEntryPage";

test.describe("BlogEntryBody", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockSlugBlogEntryPage(msw);

        await page.goto(
            `/blog/entry/${mockValuePublicBlogEntryController_getBlogEntryBySlug.slug}`,
        );
    });

    test("markdownに含まれているh1 - h4がh3 - h6に変更されていること。", async ({
        page,
    }) => {
        const blogEntryBody = page.locator(".blog-entry-body");
        for (const level of createIntegerRange(3, 6)) {
            await expect(
                blogEntryBody.getByRole("heading", { level }).nth(0),
            ).toBeVisible();
        }
    });

    test("markdownに含まれているh5 - h6が元のlevel + 2となるaria-level付きh6に変更されていること。", async ({
        page,
    }) => {
        const blogEntryBody = page.locator(".blog-entry-body");
        for (const level of createIntegerRange(7, 8)) {
            await expect(
                blogEntryBody.locator(`h6[aria-level="${level}"]`).nth(0),
            ).toBeVisible();
        }
    });

    test("scriptタグが除去されていること。", async ({ page, msw }) => {
        const slug = "script-test-slug";
        const scriptElementId = slug;
        const bodyWithScript = dedent`
            <script id="${slug}">console.log("this script tag should be removed")</script>
            ${mockValuePublicBlogEntryController_getBlogEntryBySlug.bodyMarkdown}
        `;
        mockGetBackendRequest(
            `/public-blog-entry/slug/${slug}` as "/public-blog-entry/slug/{slug}",
            {
                ...mockValuePublicBlogEntryController_getBlogEntryBySlug,
                bodyMarkdown: bodyWithScript,
            },
            msw,
        );
        await page.goto(`/blog/entry/${scriptElementId}`);

        await expect(page.locator(`[id="${scriptElementId}"]`)).toHaveCount(0);
    });
});
