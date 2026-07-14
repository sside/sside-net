import { expect, test } from "next/experimental/testmode/playwright/msw";

test.describe("SignInForm", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("", async ({ page }) => {
        await expect(page.locator(".sign-in-form"));
    });
});
