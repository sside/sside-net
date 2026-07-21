import * as Sentry from "@sentry/nextjs";
import { ProjectLogger } from "@sside-net/project-logger";

export const createLogger = (context: string) =>
    new ProjectLogger(context, Sentry.logger);
