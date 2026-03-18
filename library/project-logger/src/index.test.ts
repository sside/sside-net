import { describe, test, expect, beforeEach } from "@jest/globals";
import { ProjectLogger } from "./index";

const createLogObject = ProjectLogger["createLogObject"];

const message = "log object",
    bool = true,
    array = [1, 2, 3],
    error = new Error("error object");

let logObject: Record<string, unknown> = {};

beforeEach(() => {
    logObject = createLogObject(
        message,
        {
            message,
            bool,
        },
        {
            array,
            error,
        },
    );
});

describe("ProjectLogger", () => {
    describe("createLogObject", () => {
        test("全てのプロパティがマージされていること。", () => {
            expect(logObject.message).toBe(message);
            expect(logObject.bool).toBe(bool);
            expect(logObject.array).toBe(array);
        });

        test("プロパティ名が被った場合はインクリメントされた接尾辞付きにリネームされること。", () => {
            const merged = createLogObject(
                "merged",
                logObject,
                {
                    array,
                },
                {
                    array,
                },
            );
            expect(merged.array_01).toBe(array);
            expect(merged.array_02).toBe(array);
        });

        test("エラー内容がパースされていること。", () => {
            expect(
                (
                    logObject.error as {
                        name: unknown;
                    }
                ).name,
            ).toBe(error.name);
            expect(
                (
                    logObject.error as {
                        stack: unknown;
                    }
                ).stack,
            ).toBe(error.stack);
        });
    });
});
