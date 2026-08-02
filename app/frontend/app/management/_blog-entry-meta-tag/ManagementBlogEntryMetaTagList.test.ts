import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockValueBlogEntryMetaTagController_getAllWithCount } from "../../../test/mock/mockBlogEntryMetaTagController_getAllWithCount";
import { mockDefaultValues } from "../../../test/mockDefaultValues";
import { setAuthenticationCookie } from "../../../test/setAuthenticationCookie";

test.describe("ManagementBlogEntryMetaTagList", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);
        await setAuthenticationCookie(page);

        await page.goto("/management");
        await page.waitForLoadState("networkidle");
    });

    test("取得したBlogEntryMetaTag名が表示されていること。", async ({
        page,
    }) => {
        for (const {
            name,
        } of mockValueBlogEntryMetaTagController_getAllWithCount) {
            const locator = page.locator(
                ".management-blog-entry-meta-tag-list",
            );
            await expect(locator.getByText(name)).toBeVisible();
        }
    });
});
