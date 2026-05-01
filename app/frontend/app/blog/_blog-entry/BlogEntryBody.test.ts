import { expect, test } from "next/experimental/testmode/playwright/msw";
import { createIntegerRange } from "@sside-net/utility";
import dedent from "dedent";
import { mockValuePublicBlogEntryController_getBlogEntryBySlug } from "../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockBackendGetResponse } from "../../../test/mockBackendGetResponse";
import { mockDefaultValues } from "../../../test/mockDefaultValues";

test.describe("BlogEntryBody", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

        await page.goto(
            `/blog/entry/${mockValuePublicBlogEntryController_getBlogEntryBySlug.slug}`,
        );
    });

    test("markdownに含まれているh1 - h4がh3 - h6に変更されていること。", async ({
        page,
        msw,
    }) => {
        mockBackendGetResponse(
            `/public-blog-entry/slug/${mockValuePublicBlogEntryController_getBlogEntryBySlug.slug}` as "/public-blog-entry/slug/{slug}",
            {
                ...mockValuePublicBlogEntryController_getBlogEntryBySlug,
                bodyMarkdown: dedent`
                    # header 1
                    ## header 2
                    ### header 3
                    #### header 4
                `,
            },
            msw,
        );
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
        mockBackendGetResponse(
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
