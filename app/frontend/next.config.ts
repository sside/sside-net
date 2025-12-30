import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typedRoutes: true,
    experimental: {
        testProxy: true,
    },
};

export default nextConfig;
