import { getAppConfig } from "@sside-net/app-config";

type ValidationResult = true | string;
type Validator<RestArgs extends unknown[] = []> = (
    input: string,
    ...restArgs: RestArgs
) => ValidationResult;
type IteratorValidator<RestArgs extends unknown[] = []> = (
    inputs: Iterable<string>,
    ...restArgs: RestArgs
) => ValidationResult;

export const isValid = (validationResult: ValidationResult): boolean =>
    validationResult === true;

export const iteratorValidator = (
    inputs: Iterable<string>,
    validator: (input: string) => ValidationResult,
    minimumCount = 0,
): ValidationResult => {
    let validationCount = 0;

    for (const input of inputs) {
        validationCount += 1;

        if (validator(input) !== true) {
            return validator(input);
        }
    }

    if (validationCount < minimumCount) {
        return `${minimumCount}個以上入力してください。`;
    }

    return true;
};

export const validateRequired: Validator = (input) => {
    if (!input) {
        return "入力してください。";
    }

    return true;
};

export const validateLength: Validator<
    [
        {
            maximum: number;
            minimum?: number;
        },
    ]
> = (input, { maximum, minimum = 0 }) => {
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

export const validateBlogEntrySlug: Validator = (input) => {
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

export const validateBlogEntryTitle: Validator = (input) => {
    const requiredResult = validateRequired(input);
    if (typeof requiredResult === "string") {
        return requiredResult;
    }

    return validateLength(input, {
        maximum: getAppConfig().blog.validation.title.maxLength,
    });
};

export const validateBlogEntryMetaTags: IteratorValidator = (inputs) =>
    iteratorValidator(
        inputs,
        (input) => {
            const requiredResult = validateRequired(input);
            if (requiredResult !== true) {
                return requiredResult;
            }

            return validateLength(input, {
                maximum: getAppConfig().blog.validation.metaTag.maxLength,
            });
        },
        1,
    );
