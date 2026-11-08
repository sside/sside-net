import { expect, test } from "next/experimental/testmode/playwright/msw";
import { trimPathsTrailingSlash } from "@sside-net/utility";
import { components } from "../../../generated/api-client/backend-schema";
import { mockDefaultValues } from "../../../test/mockDefaultValues";
import { setAuthenticationCookie } from "../../../test/setAuthenticationCookie";

test.describe("ManagementCreateBlogEntryMetaTagButton", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);
        await setAuthenticationCookie(page);

        await page.goto("/management");
        await page.waitForLoadState("networkidle");
    });

    test("入力したMetaTag名が送信されること。", async ({ page }) => {
        const META_TAG_NAME = "meta-tag-name";
        const locator = page.locator(
            ".management-create-blog-entry-meta-tag-button",
        );

        page.once("dialog", async (dialog) => {
            expect(dialog.type()).toBe("prompt");

            await dialog.accept(META_TAG_NAME);
        });
        const waitForRequest = page.waitForRequest(
            (request) =>
                trimPathsTrailingSlash(new URL(request.url()).pathname) ===
                    "/private/blog-entry-meta-tag" &&
                request.method() === "POST",
        );

        await locator.click();
        const request = await waitForRequest;

        expect(
            (
                request.postDataJSON() as components["schemas"]["BlogEntryMetaTagRequest"]
            ).name,
        ).toBe(META_TAG_NAME);
    });
});
