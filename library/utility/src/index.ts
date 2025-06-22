import { Nullish } from "utility-types";

export const parseDecimalFloat = (input: string | number | Nullish): number =>
    input === null ? NaN : Number(input);

export const parseDecimalInt = (input: string | number | Nullish): number =>
    Math.trunc(parseDecimalFloat(input));
