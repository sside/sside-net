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
        sentry: {
            projectName: "sside-net-backend",
        },
    },
} satisfies DeepPartial<AppConfig>;
