import { getAppConfig } from "@sside-net/app-config";
import { Logger, pino } from "pino";
import { Primitive } from "utility-types";

type LogInputObject = Record<string, unknown> | Primitive | Error;

export class ProjectLogger {
    private logger: Logger;

    constructor(context: string) {
        this.logger = pino({
            name: context,
            level: getAppConfig().global.log.level,
        });
    }

    private static createLogObject(
        message: string,
        ...logObjects: LogInputObject[]
    ): Record<string, unknown> {
        return ProjectLogger.mergeLogMessageObjects([
            { message },
            ...logObjects,
        ]);
    }

    private static errorToLogObject(error: Error): Record<string, unknown> {
        return {
            errorName: error.name,
            errorMessage: error.message,
            stack: error.stack,
            cause: error.cause,
        };
    }

    private static mergeLogMessageObjects(
        logObjects: LogInputObject[],
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
                if (typeof inputItem === "undefined") {
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

        return ProjectLogger.mergeLogMessageObjects([target, ...rest]);
    }

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

    log(message: string, ...logObjects: LogInputObject[]): void {
        for (const item of [message, ...logObjects]) {
            console.log("log method", typeof item, JSON.stringify(item));
        }
        this.logger.info(ProjectLogger.createLogObject(message, ...logObjects));
    }

    debug(message: string, ...logObjects: LogInputObject[]): void {
        this.logger.debug(
            ProjectLogger.createLogObject(message, ...logObjects),
        );
    }

    warn(message: string, ...logObjects: LogInputObject[]): void {
        this.logger.warn(ProjectLogger.createLogObject(message, ...logObjects));
    }

    error(message: string, ...logObjects: LogInputObject[]): void {
        this.logger.error(
            ProjectLogger.createLogObject(message, ...logObjects),
        );
    }
}
