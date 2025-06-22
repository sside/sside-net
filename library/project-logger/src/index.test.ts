import { ProjectLogger } from "./index";

const createLogObject = ProjectLogger["createLogObject"];

const message = "log object",
    bool = true,
    arr = [1, 2, 3],
    err = new Error("error object");

let logObject: Record<string, unknown> = {};

beforeEach(() => {
    logObject = createLogObject(
        message,
        {
            message,
            bool,
        },
        {
            arr,
            err,
        },
    );
});

describe("ProjectLogger", () => {
    describe("createLogObject", () => {
        test("全てのプロパティがマージされていること。", () => {
            expect(logObject.message).toBe(message);
            expect(logObject.bool).toBe(bool);
            expect(logObject.arr).toBe(arr);
        });

        test("プロパティ名が被った場合はインクリメントされた接尾辞付きにリネームされること。", () => {
            const merged = createLogObject(
                "merged",
                logObject,
                {
                    arr,
                },
                {
                    arr,
                },
            );
            expect(merged.arr_01).toBe(arr);
            expect(merged.arr_02).toBe(arr);
        });

        test("エラー内容がパースされていること。", () => {
            expect(
                (
                    logObject.err as {
                        name: unknown;
                    }
                ).name,
            ).toBe(err.name);
            expect(
                (
                    logObject.err as {
                        stack: unknown;
                    }
                ).stack,
            ).toBe(err.stack);
        });
    });
});
