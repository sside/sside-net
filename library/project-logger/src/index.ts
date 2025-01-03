import { pino } from "pino";
import { isPrimitive } from "utility-types";

export class ProjectLogger {
    private readonly pino;

    constructor(private readonly context?: string) {
        this.pino = pino({});
    }

    debug(message: string, logObject: unknown, ...rest: unknown[]): void {
        this.pino.debug(this.createLogMessage(message, logObject, ...rest));

        return;
    }

    log(message: string, logObject: unknown, ...rest: unknown[]): void {
        this.pino.info(this.createLogMessage(message, logObject, ...rest));

        return;
    }

    warn(message: string, logObject: unknown, ...rest: unknown[]): void {
        this.pino.warn(this.createLogMessage(message, logObject, ...rest));

        return;
    }

    error(message: string, logObject: unknown, ...rest: unknown[]): void {
        this.pino.error(this.createLogMessage(message, logObject, ...rest));

        return;
    }

    private createLogMessage(
        message: string,
        ...logItems: unknown[]
    ): Record<string, unknown> {
        let logObject: Record<string, unknown> = {
            message,
        };

        if (this.context) {
            logObject.context = this.context;
        }

        for (const logItem of logItems) {
            if (isPrimitive(logItem) || Array.isArray(logItem)) {
                logObject = this.appendNonDuplicatedProperty(
                    logObject,
                    "value",
                    logItem,
                    logItems.length,
                );
            }

            for (const [key, value] of Object.entries(
                logItem as Record<string, unknown>,
            )) {
                logObject = this.appendNonDuplicatedProperty(
                    logObject,
                    key,
                    value,
                    logItems.length,
                );
            }
        }

        return logObject;
    }

    private appendNonDuplicatedProperty(
        logObject: Record<string, unknown>,
        propertyName: string,
        value: unknown,
        maxSuffixNumber: number,
    ): Record<string, unknown> {
        if (typeof logObject[propertyName] === "undefined") {
            logObject[propertyName] = value;

            return logObject;
        }

        for (let i = 1; i < maxSuffixNumber; i++) {
            const suffixedPropertyName = propertyName + "_" + i.toString(10);
            if (!logObject[suffixedPropertyName]) {
                logObject[suffixedPropertyName] = value;

                return logObject;
            }
        }

        return logObject;
    }
}
