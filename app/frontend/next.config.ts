import type { NextConfig } from "next";
import { isTestEnvironment } from "@sside-net/utility";

const nextConfig: NextConfig = {
    typedRoutes: true,
    experimental: {
        testProxy: isTestEnvironment(),
    },
    transpilePackages: ["@yaireo/tagify"],
};

export default nextConfig;
