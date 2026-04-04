import { EnvironmentType } from "@sside-net/constant";
import { ProjectLogger } from "@sside-net/project-logger";
import { Nullish } from "utility-types";

/**
 * 10進数浮動小数点をパースします。
 */
export const parseDecimalFloat = (input: string | number | Nullish): number =>
    input === null ? Number.NaN : Number(input);

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
        throw new TypeError(`整数以外が入力されています。`);
    }

    if (start < 0) {
        throw new Error(`負数が入力されています。`);
    }

    return Array.from({ length }).map((_, index) => index + start);
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
    const range = Array.from({
        length: large - small + 1,
    }).map((_, index) => index + small);

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

/**
 * 実行中の環境が本番環境か判定します。
 */
export const isProductionEnvironment = (): boolean =>
    getEnvironmentType() === EnvironmentType.Production;
/**
 * 実行中の環境が開発環境か判定します。
 */
export const isDevelopmentEnvironment = (): boolean =>
    getEnvironmentType() !== EnvironmentType.Production;
/**
 * 実行中の環境がテスト環境か判定します。
 */
export const isTestEnvironment = (): boolean =>
    getEnvironmentType() === EnvironmentType.Test;

/**
 * Error.stackをログするとき、呼び出し元の関数が分かるように必要な行のみトリムします。
 */
const trimStackTraceLines = (stack?: string): string =>
    stack
        ?.split("\n")
        .map((line) => line.trim())
        .slice(2, 5)
        .join("\n") ?? "";

/**
 * 値の取得が未実装の場合に、後から見つけられるようにするため値をstabします。
 * 実行時、呼び出し個所を確認できるようにスタックトレースの一部をログに残します。
 */
export const notImplementedStab = <T>(argument: T): T => {
    const logger = new ProjectLogger("notImplementedStab");
    const { stack } = new Error("スタック取得");
    logger.warn("未実装の値をstabしています。", {
        arg: argument,
        stackTrace: trimStackTraceLines(stack),
    });

    return argument;
};

/**
 * 関数が未実装の場合に、後から見つけられるようにするための仮実装関数です。
 * 実行時、呼び出し個所を確認できるようにスタックトレースの一部をログに残します。
 */
export const notImplementedVoid = (...args: unknown[]): void => {
    const logger = new ProjectLogger("notImplementedVoid");
    const { stack } = new Error("スタック取得");
    logger.warn("未実装の関数をstabしています。", {
        args,
        stackTrace: trimStackTraceLines(stack),
    });

    return;
};

/**
 * 非同期関数が未実装の場合に、後から見つけられるようにするための仮実装関数です。
 * 実行時、呼び出し個所を確認できるようにスタックトレースの一部をログに残します。
 */
export const notImplementedPromisedVoid = async (
    ...args: unknown[]
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
