import { defineConfig } from "next/experimental/testmode/playwright/msw";
import { config } from "@dotenvx/dotenvx";
import { getAppConfig } from "@sside-net/app-config";
import { resolve } from "node:path";

// このプロジェクト内では通常.envを参照するときはシェルでdotenvxを実行するが、それだとtestファイルに環境変数が載らないためここで読み込んでいる。
config({ path: resolve(__dirname, "../../", ".env.test") });
const {
    frontend: { baseUrl: frontendBaseUrl },
} = getAppConfig();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./app",
    testMatch: "app/**/*.test.ts",
    expect: {
        timeout: 2000,
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: 2,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "html",
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('')`. */
        baseURL: frontendBaseUrl,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
    },

    /* Configure projects for major browsers */
    // FIXME: next/experimental/testmodeでは機能しないのでコメントアウト。ソリューションを見つけたら戻す。
    // projects: [
    //     {
    //         name: "Google Chrome",
    //         use: { ...devices["Desktop Chrome"], channel: "chrome" },
    //     },
    //     {
    //         name: "Mobile Safari",
    //         use: { ...devices["iPhone 15"] },
    //     },
    // ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: `npm run build && cross-env PORT=${new URL(frontendBaseUrl).port} npm run start`,
        url: frontendBaseUrl,
        reuseExistingServer: !process.env.CI,
    },
});
