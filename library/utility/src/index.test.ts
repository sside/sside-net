import {
    createIntegerRange,
    parseDecimalFloat,
    parseDecimalInt,
} from "./index";

describe("parseDecimalFloat", () => {
    test("浮動小数点の文字列を数値に変換できること。", () => {
        const a = 123456;
        const b = 123.456789;
        expect(parseDecimalFloat("123456.789")).toBe(123456.789);
        expect(parseDecimalFloat(a)).toBe(a);
        expect(parseDecimalFloat(b)).toBe(b);
    });
    test("数値以外はNaNを返すこと。", () => {
        expect(parseDecimalFloat(null)).toBeNaN();
        expect(parseDecimalFloat(undefined)).toBeNaN();
        expect(parseDecimalFloat("not number")).toBeNaN();
        expect(parseDecimalFloat("includes number 123")).toBeNaN();
    });
});

describe("parseDecimalInt", () => {
    test("入力値を整数にして返していること。", () => {
        expect(parseDecimalInt("123456.789")).toBe(123456);
        expect(parseDecimalInt(123456)).toBe(123456);
        expect(parseDecimalInt("123456")).toBe(123456);
        expect(parseDecimalInt("0.123456")).toBe(0);
        expect(parseDecimalInt("-123456")).toBe(-123456);
    });
});

describe("createIntegerRange", () => {
    test("指定された範囲の整数が返ること。", () => {
        expect(createIntegerRange(3, 12)).toStrictEqual([
            3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        ]);
        expect(createIntegerRange(0, 4)).toStrictEqual([0, 1, 2, 3, 4]);
    });

    test("逆順の数値を返せること。", () => {
        expect(createIntegerRange(10, 7)).toStrictEqual([10, 9, 8, 7]);
    });

    test("整数以外を入力するとエラーになること。", () => {
        expect(() => createIntegerRange(0, 0.8)).toThrow(/整数/);
        expect(() => createIntegerRange(2.3, 8)).toThrow(/整数/);
    });

    test("同じ値を入力するとエラーになること。", () => {
        expect(() => createIntegerRange(3, 3)).toThrow(/同じ/);
    });

    test("負の値を入力するとエラーになること。", () => {
        expect(() => createIntegerRange(3, -2)).toThrow(/負/);
        expect(() => createIntegerRange(-1, -2)).toThrow(/負/);
        expect(() => createIntegerRange(-1, 2)).toThrow(/負/);
    });
});
