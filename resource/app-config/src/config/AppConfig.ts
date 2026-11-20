import { LogLevel } from "@sside-net/constant";

export type AppConfig = {
    global: {
        appName: "sside.net";
        author: "sside";
        log: {
            level: LogLevel;
        };
        sentry: {
            organizationName: "ssidenet";
        };
        baseUrl: {
            frontend: string;
            backend: string;
        };
        authentication: {
            accessTokenExpireSecond: number;
            refreshTokenExpireSecond: number;
        };
    };
    frontend: {
        blog: {
            blogEntry: {
                displayPerPage: number;
            };
            menu: {
                recentBlogEntryCount: number;
            };
            feed: {
                recentFeedEntryCount: number;
                description: string;
                copyright: string;
            };
        };
        sentry: {
            projectName: "sside-net-frontend";
        };
        apiClient: {
            onErrorRetryCount: number;
        };
    };
    backend: {
        blogEntry: {
            public: {
                maximumFetchCountPerOnce: number;
            };
        };
        rateLimit: {
            timeToLiveSecond: number;
            requestCount: number;
        };
        sentry: {
            projectName: "sside-net-backend";
        };
    };
    blog: {
        validation: {
            title: {
                maxLength: number;
            };
            slug: {
                maxLength: number;
            };
            metaTag: {
                maxLength: number;
            };
        };
    };
};
