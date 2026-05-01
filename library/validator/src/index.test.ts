import { fakerEN } from "@faker-js/faker";
import { describe, expect, test } from "@jest/globals";
import { getAppConfig } from "@sside-net/app-config";
import {
    validateBlogEntrySlug,
    validateBlogEntryTitle,
    validateLength,
} from "./index";

describe("validator", () => {
    describe("validateRequired", () => {
        test("空の入力値は跳ねること。", () => {
            expect(
                validateBlogEntrySlug(undefined as unknown as string),
            ).toMatch(/入力してください/);
            expect(validateBlogEntrySlug("")).toMatch(/入力してください/);
        });
    });

    describe("validateLength", () => {
        test("最大長を超過した場合は跳ねること。", () => {
            expect(
                validateLength(fakerEN.string.alpha(100), { maximum: 10 }),
            ).toMatch(/最大文字数/);
        });

        test("最小長未満の場合は跳ねること。", () => {
            expect(
                validateLength(fakerEN.string.alpha(10), {
                    maximum: Number.MAX_SAFE_INTEGER,
                    minimum: 100,
                }),
            ).toMatch(/最小文字数/);
        });

        test("所定のレンジ内の入力の場合はパスすること。", () => {
            expect(
                validateLength(fakerEN.string.alpha(100), { maximum: 1000 }),
            ).toBe(true);
        });
    });

    describe("validateBlogEntryTitle", () => {
        test("最大長を超過した場合は跳ねること。", () => {
            expect(
                validateBlogEntryTitle(
                    fakerEN.string.alpha(
                        getAppConfig().blog.validation.title.maxLength + 1,
                    ),
                ),
            ).toMatch(/最大文字数/);
        });
    });

    describe("validateSlug", () => {
        test("[a-zA-Z0-9-]のみが入力される場合はパスすること。", () => {
            expect(validateBlogEntrySlug(`abcABC012-987`)).toBe(true);
        });

        test("[a-zA-Z0-9-]以外を含む文字列が入力された場合は跳ねること。", () => {
            expect(validateBlogEntrySlug(`abcABC1ほげ23`)).toBe(
                "使用できる文字は[a-zA-Z0-9-]のみです。",
            );
        });

        test("空文字列を跳ねること", () => {
            expect(validateBlogEntrySlug("")).toBe("入力してください。");
        });

        test("最大文字数以上を入力すると跳ねること。", () => {
            expect(
                validateBlogEntrySlug(
                    fakerEN.string.alphanumeric(
                        getAppConfig().blog.validation.slug.maxLength + 1,
                    ),
                ),
            ).toMatch(/最大文字数/);
        });
    });
});
