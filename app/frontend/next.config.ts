import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { getAppConfig } from "@sside-net/app-config";
import { isTestEnvironment } from "@sside-net/utility";

const nextConfig: NextConfig = {
    typedRoutes: true,
    experimental: {
        testProxy: isTestEnvironment(),
    },
    transpilePackages: ["@yaireo/tagify"],
};

const appConfig = getAppConfig();
export default withSentryConfig(nextConfig, {
    org: appConfig.global.sentry.organizationName,
    project: appConfig.frontend.sentry.projectName,
    authToken: process.env.SENTRY_AUTH_TOKEN,
});
