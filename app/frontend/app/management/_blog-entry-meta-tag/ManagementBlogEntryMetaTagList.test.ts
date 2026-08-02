import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockDefaultValues } from "../../../test/mockDefaultValues";
import { setAuthenticationCookie } from "../../../test/setAuthenticationCookie";

test.describe("ManagementBlogEntryMetaTagList", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);
        await setAuthenticationCookie(page);

        await page.goto("/management");
        await page.waitForLoadState("networkidle");
    });

    test("", async ({ page }) => {
        await expect(
            page.locator(".management-blog-entry-meta-tag-list"),
        ).toBeVisible();
    });
});
