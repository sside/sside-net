import { LoggerService } from "@nestjs/common";
import { ProjectLogger } from "@sside-net/project-logger";

export class JsonLogger implements LoggerService {
    private readonly projectLogger: ProjectLogger;

    constructor(context?: string) {
        this.projectLogger = new ProjectLogger(context ?? "not defined");
    }

    log(...args: Parameters<LoggerService["log"]>): void {
        this.projectLogger.log(...args);
    }

    warn(...args: Parameters<LoggerService["warn"]>) {
        this.projectLogger.warn(...args);
    }

    error(...args: Parameters<LoggerService["error"]>) {
        this.projectLogger.error(...args);
    }

    debug(...args: Parameters<LoggerService["log"]>) {
        this.projectLogger.debug(...args);
    }

    fatal(...args: Parameters<LoggerService["log"]>) {
        this.projectLogger.debug(...args);
    }

    verbose(...args: Parameters<LoggerService["log"]>) {
        this.projectLogger.debug(...args);
    }
}
