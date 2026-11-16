import { getAppConfig } from "@sside-net/app-config";
import { parseDecimalInt } from "@sside-net/utility";

type ValidationResult = true | string;
type Validator<RestArgs extends unknown[] = [], Input = string | number> = (
    input: Input,
    ...restArgs: RestArgs
) => ValidationResult;
type IteratorValidator<RestArgs extends unknown[] = []> = (
    inputs: Iterable<string> | unknown,
    ...restArgs: RestArgs
) => ValidationResult;

export const isValid = (validationResult: ValidationResult): boolean =>
    validationResult === true;

const isString = (input: unknown): input is string => typeof input === "string";

export const validateString: Validator = (input: unknown) =>
    isString(input) || "文字列を入力してください。";

const isIterable = (inputs: unknown): inputs is Iterable<unknown> =>
    !!inputs &&
    typeof inputs === "object" &&
    Symbol.iterator in inputs &&
    typeof inputs[Symbol.iterator] === "function";

const isIterableStrings = (inputs: unknown): inputs is Iterable<string> => {
    if (!isIterable(inputs)) {
        return false;
    }

    for (const input of inputs) {
        if (!isString(input)) {
            return false;
        }
    }

    return true;
};

export const validateIterableStrings: IteratorValidator = (inputs: unknown) =>
    isIterableStrings(inputs) || "反復可能な文字列を入力してください。";

/**
 * Validatorを渡してIterableな対象をバリデーションします。
 */
export const iteratorValidator = (
    inputs: Iterable<string> | unknown,
    validator: (input: string) => ValidationResult,
    minimumCount = 0,
): ValidationResult => {
    if (!isIterableStrings(inputs)) {
        return validateIterableStrings(inputs);
    }

    let validationCount = 0;

    for (const input of inputs) {
        validationCount += 1;

        if (validator(input) !== true) {
            return validator(input);
        }
    }

    return validationCount < minimumCount ?
            `${minimumCount}個以上入力してください。`
        :   true;
};

const VALIDATE_YEAR_DEFAULT_MINIMUM_YEAR = 1970;
const VALIDATE_YEAR_DEFAULT_MAXIMUM_YEAR = 2099;
/**
 * 年が所定の範囲に含まれるかのバリデーションを行います。
 */
export const validateYear: Validator<
    [
        {
            maximum?: number;
            minimum?: number;
        }?,
    ]
> = (input: string | number, range) => {
    const parsed = parseDecimalInt(input);

    const minimum = range?.minimum ?? VALIDATE_YEAR_DEFAULT_MINIMUM_YEAR;
    const maximum = range?.maximum ?? VALIDATE_YEAR_DEFAULT_MAXIMUM_YEAR;

    return (
        (minimum <= parsed && parsed <= maximum) ||
        `年は ${minimum} - ${maximum} の数値を入力してください。`
    );
};

/**
 * 月として正しい値かのバリデーションを行います。
 */
export const validateMonth: Validator = (input: string | number) => {
    const parsed = parseDecimalInt(input);

    return (
        (1 <= parsed && parsed <= 12) || `月は 1 - 12 の間を入力してください。`
    );
};

/**
 * 必須入力のバリデーションを行います。
 */
export const validateRequired: Validator<never[], unknown> = (input) => {
    return input ? true : "入力してください。";
};

/**
 * 入力値が対象の配列内に含まれているかのバリデーションを行います。
 */
export const validateInEnum: Validator<[string[]]> = (input, enums) => {
    return isString(input) ?
            enums.includes(input) ||
                `[${enums.join(", ")}]の何れかを入力してください。`
        :   validateString(input);
};

/**
 * 入力長のバリデーションを行います。
 */
export const validateLength: Validator<
    [
        {
            maximum: number;
            minimum?: number;
        },
    ]
> = (input, { maximum, minimum = 0 }) => {
    if (!isString(input)) {
        return validateString(input);
    }

    const inputLength = [
        ...new Intl.Segmenter("ja", {
            granularity: "grapheme",
        }).segment(input),
    ].length;

    if (inputLength > maximum) {
        return `入力の最大文字数は${maximum}文字です。`;
    }

    if (inputLength < minimum) {
        return `入力の最小文字数は${minimum}文字です。`;
    }

    return true;
};

/**
 * BlogEntryのSlugとしてバリデーションを行います。。
 */
export const validateBlogEntrySlug: Validator = (input) => {
    if (!isString(input)) {
        return validateString(input);
    }

    const requiredResult = validateRequired(input);
    if (typeof requiredResult === "string") {
        return requiredResult;
    }

    const lengthResult = validateLength(input, {
        maximum: getAppConfig().blog.validation.slug.maxLength,
    });
    if (typeof lengthResult === "string") {
        return lengthResult;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(input)) {
        return "使用できる文字は[a-zA-Z0-9-]のみです。";
    }

    return true;
};

/**
 * BlogEntryのタイトルとしてバリデーションを行います。
 */
export const validateBlogEntryTitle: Validator = (input) => {
    const requiredResult = validateRequired(input);
    if (typeof requiredResult === "string") {
        return requiredResult;
    }

    return validateLength(input, {
        maximum: getAppConfig().blog.validation.title.maxLength,
    });
};

/**
 *
 */
export const validateBlogEntryMetaTag: Validator = (input) => {
    const requiredResult = validateRequired(input);
    if (requiredResult !== true) {
        return requiredResult;
    }

    return validateLength(input, {
        maximum: getAppConfig().blog.validation.metaTag.maxLength,
    });
};

/**
 * BlogEntryMetaTag名称のバリデーションを行います。
 */
export const validateBlogEntryMetaTags: IteratorValidator = (inputs) =>
    iteratorValidator(inputs, validateBlogEntryMetaTag);
