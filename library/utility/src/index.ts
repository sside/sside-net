import { EnvironmentType } from "@sside-net/constant";
import { ProjectLogger } from "@sside-net/project-logger";
import { Nullish } from "utility-types";

/**
 * 10進数浮動小数点をパースします。
 */
export const parseDecimalFloat = (input: string | number | Nullish): number =>
    input === null ? NaN : Number(input);

/**
 * 10進数整数をパースします。parseIntよりrobustです。
 */
export const parseDecimalInt = (input: string | number | Nullish): number =>
    Math.trunc(parseDecimalFloat(input));

/**
 * 整数で昇順の配列を作成します。
 */
export const createIntegerArray = (length: number, start = 0): number[] => {
    if (!Number.isInteger(start)) {
        throw new Error(`整数以外が入力されています。`);
    }

    if (start < 0) {
        throw new Error(`負数が入力されています。`);
    }

    return Array(length)
        .fill(undefined)
        .map((_, index) => index + start);
};

/**
 * 指定した範囲の整数レンジ配列を作成します。
 * startよりendが小さい場合は降順になります。
 */
export const createIntegerRange = (start: number, end: number): number[] => {
    if (![start, end].every(Number.isInteger)) {
        throw new Error("整数以外が入力されています。");
    }

    if ([start, end].some((value) => value < 0)) {
        throw new Error("負の数値が入力されています。");
    }

    if (start === end) {
        throw new Error("startとendが同じ値です。");
    }

    const isIncrease = start < end;
    const [small, large] = isIncrease ? [start, end] : [end, start];
    const range = Array(large - small + 1)
        .fill(0)
        .map((_, index) => index + small);

    return isIncrease ? range : range.toReversed();
};

/**
 * 環境変数種別を取得します。
 */
export const getEnvironmentType = (
    environmentType?: string,
): EnvironmentType => {
    const solvedEnvironmentType = (
        environmentType ??
        process.env.NEXT_PUBLIC_APP_ENV ??
        process.env.APP_ENV
    )?.trim();

    if (
        !Object.values(EnvironmentType).includes(
            solvedEnvironmentType as EnvironmentType,
        )
    ) {
        throw new Error(
            `未定義の環境種別を参照しようとしています。solvedEnvironmentType: ${solvedEnvironmentType}, inputValue: ${environmentType} NEXT_PUBLIC_APP_ENV: ${process.env.NEXT_PUBLIC_APP_ENV}, APP_ENV: ${process.env.APP_ENV}`,
        );
    }

    return solvedEnvironmentType as EnvironmentType;
};

const trimStackTraceLines = (stack?: string): string =>
    stack
        ?.split("\n")
        .map((line) => line.trim())
        .join("\n") ?? "";

/**
 * 値の取得が未実装の場合に、後から見つけられるようにするためのスタブ関数。
 */
export const notImplementedStab = <T>(arg: T): T => {
    const logger = new ProjectLogger("notImplementedStab");
    const { stack } = new Error();
    logger.warn("未実装の値をstabしています。", {
        arg,
        stackTrace: trimStackTraceLines(stack),
    });

    return arg;
};

/**
 * 関数が未実装の場合に、後から見つけられるようにするための仮実装関数。
 */
export const notImplementedVoid = (...args: unknown[]): void => {
    const logger = new ProjectLogger("notImplementedVoid");
    const { stack } = new Error();
    logger.warn("未実装の関数をstabしています。", {
        args,
        stackTrace: trimStackTraceLines(stack),
    });

    return;
};

/**
 * 非同期関数が未実装の場合に、後から見つけられるようにするための仮実装関数。
 */
export const notImplementedPromisedVoid = async (
    ...args: Parameters<typeof notImplementedStab>
): Promise<void> => {
    setTimeout(
        () =>
            new Promise((resolve) => {
                notImplementedVoid(...args);
                resolve(undefined);
            }),
        10,
    );
};
