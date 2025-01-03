import { ConsoleLogger, Injectable, LogLevel } from "@nestjs/common";
import { ProjectLogger } from "@sside-net/project-logger";

@Injectable()
export class LoggerService extends ConsoleLogger {
    private readonly projectLogger = new ProjectLogger();

    protected override printMessages(
        [firstMessage, ...messages]: unknown[],
        context?: string,
        logLevel?: LogLevel,
    ) {
        switch (logLevel) {
            case "debug":
                this.projectLogger.debug(
                    firstMessage as string,
                    {
                        context,
                    },
                    ...messages,
                );

                return;
            case "warn":
                this.projectLogger.warn(
                    firstMessage as string,
                    {
                        context,
                    },
                    ...messages,
                );

                return;
            case "error":
                this.projectLogger.error(
                    firstMessage as string,
                    {
                        context,
                    },
                    ...messages,
                );

                return;
            case "log":
            default:
                this.projectLogger.log(
                    firstMessage as string,
                    {
                        context,
                    },
                    ...messages,
                );

                return;
        }
    }
}
