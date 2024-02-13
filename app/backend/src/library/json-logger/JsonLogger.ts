import { ConsoleLogger, LogLevel } from "@nestjs/common";
import { isPlainObject } from "@nestjs/common/utils/shared.utils";
import * as process from "process";

export class JsonLogger extends ConsoleLogger {
    private lastTimeStampMillisecond = new Date();

    protected override printMessages(
        messages: unknown[],
        context?: string,
        logLevel: LogLevel = "log",
        writeStreamType?: "stdout" | "stderr",
    ): void {
        let messageBody: Record<string, unknown> = {
            context,
            logLevel: logLevel?.toUpperCase(),
            timestampDiff: this.getSpentTimeDiffMillisecond() + "ms",
        };

        for (const message of messages) {
            let messageItem: Record<string, unknown> = {};

            if (typeof message === "string") {
                messageItem = { message: message };
            } else if (isPlainObject(message)) {
                messageItem = message as Record<string, unknown>;
            }

            messageBody = this.appendItemToMessageItem(
                messageItem,
                messageBody,
            );
        }

        const logMessage = this.colorize(
            JSON.stringify(messageBody) + "\n",
            logLevel,
        );

        process[writeStreamType ?? "stdout"].write(logMessage);
    }

    private appendItemToMessageItem(
        messageItem: Record<string, unknown>,
        messageBody: Record<string, unknown>,
    ): Record<string, unknown> {
        let message = { ...messageBody };

        for (const key of Object.keys(messageItem)) {
            message = {
                ...message,
                [this.getNonDuplicatedObjectKey(key, message)]:
                    messageItem[key],
            };
        }

        return message;
    }

    private getNonDuplicatedObjectKey(
        key: string,
        object: Record<string, unknown>,
    ): string {
        if (!object[key]) {
            return key;
        }

        let existMaxSuffixNumber = 0;
        const suffixNumberRegexp = new RegExp(`^${key}_(\\d+)$`);
        for (const existKey of Object.keys(object).filter((objectKey) =>
            objectKey.startsWith(key),
        )) {
            const suffix = suffixNumberRegexp.exec(existKey)?.at(1);
            if (suffix) {
                const parsedSuffix = parseInt(suffix, 10);
                if (
                    Number.isInteger(parsedSuffix) &&
                    parsedSuffix > existMaxSuffixNumber
                ) {
                    existMaxSuffixNumber = parsedSuffix;
                }
            }
        }

        return `${key}_${(existMaxSuffixNumber + 1).toString().padStart(2, "0")}`;
    }

    private getSpentTimeDiffMillisecond(): number {
        const now = new Date();
        const diffMillisecond =
            now.getTime() - this.lastTimeStampMillisecond.getTime();
        this.lastTimeStampMillisecond = now;
        return diffMillisecond;
    }
}
