import type { logger as SentryLogger } from "@sentry/core";
import { getAppConfig } from "@sside-net/app-config";
import { LogLevel } from "@sside-net/constant";
import Pino, { Logger } from "pino";
import { Primitive } from "utility-types";

export type ProjectLoggerInputObject =
    | Record<string, unknown>
    | Primitive
    | Error;

export class ProjectLogger {
    private readonly pinoLogger: Logger;
    private readonly logLevel: LogLevel;

    constructor(
        private readonly context: string,
        private readonly sentryLogger?: typeof SentryLogger,
    ) {
        this.pinoLogger = Pino();
        this.logLevel = getAppConfig().global.log.level;
    }

    private static errorToLogObject(error: Error): Record<string, unknown> {
        return {
            errorName: error.name,
            errorMessage: error.message,
            stack: error.stack,
            cause: error.cause,
        };
    }

    /**
     * 入力されたログ対象の値を単一のRecordにマージします。
     */
    private static mergeLogMessageObjectsRecursive(
        logObjects: ProjectLoggerInputObject[],
    ): Record<string, unknown> {
        const [inputTarget, inputMergeItem, ...rest] = logObjects;
        const [target, mergeItem] = [inputTarget, inputMergeItem].map(
            (inputItem) => {
                if (inputItem instanceof Error) {
                    return ProjectLogger.errorToLogObject(inputItem);
                }

                if (inputItem === null) {
                    return {
                        message: "null",
                    };
                }
                if (inputItem === undefined) {
                    return {
                        message: "undefined",
                    };
                }

                switch (typeof inputItem) {
                    case "string":
                    case "number":
                    case "bigint":
                    case "boolean":
                    case "symbol":
                    case "function":
                        return {
                            message: inputItem.toString(),
                        };
                }

                return inputItem as Record<string, unknown>;
            },
        );

        if (!inputMergeItem) {
            return target;
        }

        for (const key in mergeItem) {
            target[
                ProjectLogger.createLogObjectKeyName(key, Object.keys(target))
            ] = mergeItem[key];
        }

        return ProjectLogger.mergeLogMessageObjectsRecursive([target, ...rest]);
    }

    /**
     * 与えられたキー群にダブりがある場合、suffixに数字を付けた新しいキーを返します。
     */
    private static createLogObjectKeyName(
        key: string,
        existKeys: string[],
        maximumIndex = 99,
    ): string {
        if (!existKeys.includes(key)) {
            return key;
        }

        const createKeyName = (key: string, index: number, padLength: number) =>
            `${key}_${index.toString(10).padStart(padLength, "0")}`;

        const padLength = maximumIndex.toString(10).length;

        for (let i = 1; i < maximumIndex; i++) {
            const incrementedKey = createKeyName(key, i, padLength);
            if (!existKeys.includes(incrementedKey)) {
                return incrementedKey;
            }
        }

        // 最大値を超えたら最後の値で返す
        return createKeyName(key, maximumIndex, padLength);
    }

    log(message: string, ...logObjects: ProjectLoggerInputObject[]): void {
        this.pinoLogger.info(this.createPinoLogObject(message, logObjects));
        if (this.sentryLogger) {
            this.sentryLogger.info(
                message,
                this.createSentryLogObject(logObjects),
            );
        }
    }

    debug(message: string, ...logObjects: ProjectLoggerInputObject[]): void {
        if (this.logLevel === LogLevel.Info) {
            return;
        }

        this.pinoLogger.debug(this.createPinoLogObject(message, logObjects));
        if (this.sentryLogger) {
            this.sentryLogger.debug(
                message,
                this.createSentryLogObject(logObjects),
            );
        }
    }

    warn(message: string, ...logObjects: ProjectLoggerInputObject[]): void {
        this.pinoLogger.warn(this.createPinoLogObject(message, logObjects));
        if (this.sentryLogger) {
            this.sentryLogger.warn(
                message,
                this.createSentryLogObject(logObjects),
            );
        }
    }

    error(message: string, ...logObjects: ProjectLoggerInputObject[]): void {
        this.pinoLogger.error(this.createPinoLogObject(message, logObjects));
        if (this.sentryLogger) {
            this.sentryLogger.error(
                message,
                this.createSentryLogObject(logObjects),
            );
        }
    }

    private createPinoLogObject(
        message: string,
        logObjects: ProjectLoggerInputObject[],
    ): Record<string, unknown> {
        return ProjectLogger.mergeLogMessageObjectsRecursive([
            {
                message,
                context: this.context,
            },
            ...logObjects,
        ]);
    }

    /**
     * Sentryログ出力用にマージしたオブジェクトを作成します。
     */
    private createSentryLogObject(
        logObjects: ProjectLoggerInputObject[],
    ): Record<string, unknown> {
        return ProjectLogger.mergeLogMessageObjectsRecursive([
            {
                context: this.context,
            },
            ...logObjects,
        ]);
    }
}
