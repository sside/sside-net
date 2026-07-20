import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import {
    getEnvironmentType,
    isProductionEnvironment,
} from "@sside-net/utility";

// Ensure to call this before requiring any other modules!
Sentry.init({
    dsn: process.env.SENTRY_DSN_BACKEND,
    environment: getEnvironmentType(),

    integrations: [
        // Add our Profiling integration
        nodeProfilingIntegration(),
    ],

    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: isProductionEnvironment() ? 0.1 : 1,

    // Set sampling rate for profiling
    // This is relative to tracesSampleRate
    profilesSampleRate: 1,

    enableLogs: true,
});
