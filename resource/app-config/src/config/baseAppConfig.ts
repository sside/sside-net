import { DeepPartial } from "utility-types";
import { AppConfig } from "./AppConfig";

export const baseAppConfig = {
    global: {
        appName: "sside.net",
        log: {
            level: "info",
        },
        sentry: {
            organizationName: "ssidenet",
        },
    },
    frontend: {
        blog: {
            blogEntry: {
                displayPerPage: 4,
            },
            menu: {
                recentBlogEntryCount: 6,
            },
        },
        sentry: {
            projectName: "sside-net-frontend",
        },
    },
    backend: {
        authentication: {
            accessTokenExpireSecond: 60 * 60 * 24 * 7,
        },
        blogEntry: {
            public: {
                maximumFetchCountPerOnce: 100,
            },
        },
        rateLimit: {
            timeToLiveSecond: 60,
            requestCount: 30,
        },
        sentry: {
            projectName: "sside-net-backend",
        },
    },
    blog: {
        validation: {
            title: {
                maxLength: 200,
            },
            slug: {
                maxLength: 100,
            },
            metaTag: {
                maxLength: 40,
            },
        },
    },
} satisfies DeepPartial<AppConfig>;
