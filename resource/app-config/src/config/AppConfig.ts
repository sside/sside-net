export type AppConfig = {
    global: {
        appName: "sside.net";
        log: {
            level: "info" | "debug";
        };
        sentry: {
            organizationName: "ssidenet";
        };
    };
    frontend: {
        baseUrl: string;
        backend: {
            baseUrl: string;
        };
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
};
