import { LogLevel } from "@sside-net/constant";

export type AppConfig = {
    global: {
        appName: "sside.net";
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
        };
        sentry: {
            projectName: "sside-net-frontend";
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
