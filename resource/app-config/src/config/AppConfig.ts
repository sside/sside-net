export type AppConfig = {
    global: {
        appName: "sside.net";
        log: {
            level: "info" | "debug";
        };
        sentry: {
            organizationName: "ssidenet";
        };
        baseUrl: {
            frontend: string;
            backend: string;
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
