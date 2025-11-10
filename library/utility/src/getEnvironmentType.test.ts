// 環境変数の書き換えを行うので別のファイルにしている
import { beforeEach, describe, expect, test } from "@jest/globals";
import { EnvironmentType } from "@sside-net/constant";
import { getEnvironmentType } from "./index";

describe("getEnvironmentType", () => {
    const { Production, Test, Local } = EnvironmentType;

    beforeEach(() => {
        delete process.env.APP_ENV;
        delete process.env.NEXT_PUBLIC_APP_ENV;
    });

    test("環境種別が取得できない場合エラーになること。", () => {
        expect(() => getEnvironmentType()).toThrow(/未定義の環境種別/);
    });

    test("未定義の環境種別を入力した場合エラーになること。", () => {
        expect(() => getEnvironmentType("foo")).toThrow(/未定義の環境種別/);
        process.env.APP_ENV = "bar";
        expect(() => getEnvironmentType()).toThrow(/未定義の環境種別/);
        process.env.NEXT_PUBLIC_APP_ENV = "baz";
        expect(() => getEnvironmentType()).toThrow(/未定義の環境種別/);
    });

    // noinspection DuplicatedCode
    test("環境変数APP_ENVに定義済みの環境変数がセット済みの場合、値を取得できること。", () => {
        process.env.APP_ENV = Production;
        expect(getEnvironmentType()).toBe(Production);
        process.env.APP_ENV = Test;
        expect(getEnvironmentType()).toBe(Test);
        process.env.APP_ENV = Local;
        expect(getEnvironmentType()).toBe(Local);
    });

    // noinspection DuplicatedCode
    test("環境変数NEXT_PUBLIC_APP_ENVに定義済みの環境変数がセット済みの場合、値を取得できること。", () => {
        process.env.NEXT_PUBLIC_APP_ENV = Production;
        expect(getEnvironmentType()).toBe(Production);
        process.env.NEXT_PUBLIC_APP_ENV = Test;
        expect(getEnvironmentType()).toBe(Test);
        process.env.NEXT_PUBLIC_APP_ENV = Local;
        expect(getEnvironmentType()).toBe(Local);
    });
});
