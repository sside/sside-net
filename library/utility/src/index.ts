import { Nullish } from "utility-types";

export const parseDecimalFloat = (input: string | number | Nullish): number =>
    input === null ? NaN : Number(input);

export const parseDecimalInt = (input: string | number | Nullish): number =>
    Math.trunc(parseDecimalFloat(input));

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
