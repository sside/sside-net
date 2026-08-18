import { expect, test } from "next/experimental/testmode/playwright/msw";
import { mockManagementRoot } from "../management/_test/mockManagementRoot";

test.describe("SignInForm", () => {
    test.beforeEach(async ({ page, msw }) => {
        mockManagementRoot(msw);

        await page.goto("/sign-in");
    });

    test("入力がない場合、ログインボタンが押せないこと。", async ({ page }) => {
        const locator = page.locator(".sign-in-form");
        const passwordInput = locator.getByRole("textbox", {
            name: "password",
        });
        await expect(passwordInput).toBeVisible();

        const submitButton = locator.getByRole("button", {
            name: "sign in",
        });
        await expect(submitButton).toBeDisabled();

        await passwordInput.fill(process.env.ADMINISTRATOR_PASSWORD!);
        await expect(submitButton).not.toBeDisabled();
    });
});
