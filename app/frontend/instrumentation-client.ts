import * as Sentry from "@sentry/nextjs";
import {
    getEnvironmentType,
    isProductionEnvironment,
} from "@sside-net/utility";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN_FRONTEND,
    environment: getEnvironmentType(),

    // Capture 100% in dev, 10% in production
    // Adjust based on your traffic volume
    tracesSampleRate: isProductionEnvironment() ? 0.1 : 1,
    integrations: [
        Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
        }),
    ],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,

    // Enable logs to be sent to Sentry
    enableLogs: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
