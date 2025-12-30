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
