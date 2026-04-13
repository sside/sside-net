import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockDefaultValues } from "../../../test/mockDefaultValues";

test.describe("BlogMenu", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockDefaultValues(msw);

        await page.goto("/blog");
    });

    test("About this site", async ({ page }) => {
        await expect(page.getByText(/About this site/)).toBeVisible();
    });
});
