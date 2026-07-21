import { describe, expect, test } from "@jest/globals";
import { ProjectLogger } from "./index";

const mergeLogMessageObjectsRecursive =
    ProjectLogger["mergeLogMessageObjectsRecursive"];

const message = "log object",
    bool = true,
    array = [1, 2, 3],
    error = new Error("error object");

describe("ProjectLogger", () => {
    describe("mergeLogMessageObjects", () => {
        test("全てのプロパティがマージされていること。", () => {
            const merged = mergeLogMessageObjectsRecursive([
                message,
                {
                    message,
                    bool,
                },
                {
                    array,
                    error,
                },
            ]);

            expect(merged.message).toBe(message);
            expect(merged.bool).toBe(bool);
            expect(merged.array).toBe(array);
        });

        test("プロパティ名が被った場合はインクリメントされた接尾辞付きにリネームされること。", () => {
            const merged = mergeLogMessageObjectsRecursive([
                message,
                {
                    message,
                    bool,
                },
                {
                    array,
                },
                {
                    array,
                    bool,
                },
                {
                    array,
                    bool,
                },
            ]);

            expect(merged.message).toBe(message);
            expect(merged.message_01).toBe(message);
            expect(merged.array).toBe(array);
            expect(merged.array_01).toBe(array);
            expect(merged.array_02).toBe(array);
            expect(merged.bool).toBe(bool);
            expect(merged.bool_01).toBe(bool);
            expect(merged.bool_02).toBe(bool);
        });

        test("エラー内容がパースされていること。", () => {
            const merged = mergeLogMessageObjectsRecursive([
                message,
                {
                    message,
                    bool,
                    error,
                },
                {
                    array,
                    error,
                },
            ]);
            expect(
                (
                    merged.error as {
                        name: unknown;
                    }
                ).name,
            ).toBe(error.name);
            expect(
                (
                    merged.error as {
                        stack: unknown;
                    }
                ).stack,
            ).toBe(error.stack);
        });
    });
});
