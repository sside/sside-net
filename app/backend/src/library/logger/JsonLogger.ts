import { LoggerService } from "@nestjs/common";
import type { logger as SentryLogger } from "@sentry/core";
import * as Sentry from "@sentry/nestjs";
import { ProjectLogger } from "@sside-net/project-logger";

export class JsonLogger implements LoggerService {
    private readonly projectLogger: ProjectLogger;

    constructor(context?: string) {
        this.projectLogger = new ProjectLogger(
            context ?? "not defined",
            Sentry.logger as typeof SentryLogger,
        );
    }

    log(...arguments_: Parameters<LoggerService["log"]>): void {
        this.projectLogger.log(...arguments_);
    }

    warn(...arguments_: Parameters<LoggerService["warn"]>) {
        this.projectLogger.warn(...arguments_);
    }

    error(...arguments_: Parameters<LoggerService["error"]>) {
        this.projectLogger.error(...arguments_);
    }

    debug(...arguments_: Parameters<LoggerService["log"]>) {
        this.projectLogger.debug(...arguments_);
    }

    fatal(...arguments_: Parameters<LoggerService["log"]>) {
        this.projectLogger.debug(...arguments_);
    }

    verbose(...arguments_: Parameters<LoggerService["log"]>) {
        this.projectLogger.debug(...arguments_);
    }
}
