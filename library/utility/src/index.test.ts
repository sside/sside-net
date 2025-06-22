import { parseDecimalFloat, parseDecimalInt } from "./index";

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
