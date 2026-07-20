import * as Sentry from "@sentry/nextjs";
import { isProductionEnvironment } from "@sside-net/utility";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN_FRONTEND,

    // Capture 100% in dev, 10% in production
    // Adjust based on your traffic volume
    tracesSampleRate: isProductionEnvironment() ? 0.1 : 1,

    // Enable logs to be sent to Sentry
    enableLogs: true,
});
