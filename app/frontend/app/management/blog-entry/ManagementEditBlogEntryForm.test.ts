import { expect } from "@playwright/test";
import dedent from "dedent";
import { components } from "../../../library/api-client/backend-schema";
import { test } from "../../../test/clientTest";
import { mockDefaultValues } from "../../../test/mockDefaultValues";

test.describe("ManagementEditBlogEntryForm", () => {
    test.beforeEach(async ({ page, network }) => {
        mockDefaultValues(network);

        await page.goto(`/management/blog-entry/create`);
    });

    const title = "title";
    const slug = "this-is-slug";
    const metaTag = "meta-tag";
    const publishAtDateTimeLocal = "2026-01-01T00:00";
    const bodyMarkdown = dedent`
        this is markdown entry
    `;

    test("全ての項目に入力しないとPublishボタンが押せないこと。", async ({
        page,
    }) => {
        const locator = page.locator(".management-edit-blog-entry-form");
        const submitButton = locator.getByRole("button", {
            name: "publish",
        });
        await expect(submitButton).toBeDisabled();

        await locator
            .getByRole("textbox", {
                name: "title",
            })
            .fill(title);
        await expect(submitButton).toBeDisabled();

        await locator
            .getByRole("textbox", {
                name: "slug",
            })
            .fill(slug);
        await expect(submitButton).toBeDisabled();

        await locator
            .getByRole("textbox", {
                name: "tags input field",
            })
            .click();
        await page.keyboard.type(`${metaTag},`);
        await locator.click();
        await expect(submitButton).toBeDisabled();

        await locator.getByLabel("publish at", {}).fill(publishAtDateTimeLocal);
        await expect(submitButton).toBeDisabled();

        await locator
            .locator(".management-blog-entry-body-markdown-editor")
            .getByRole("textbox")
            .fill(bodyMarkdown);
        await locator.click();

        await expect(submitButton).not.toBeDisabled();
    });

    test("入力した値が送信されること。", async ({ page, context }) => {
        const locator = page.locator(".management-edit-blog-entry-form");

        await locator
            .getByRole("textbox", {
                name: "title",
            })
            .fill(title);
        await locator
            .getByRole("textbox", {
                name: "slug",
            })
            .fill(slug);
        await locator
            .getByRole("textbox", {
                name: "tags input field",
            })
            .click();
        await page.keyboard.type(`${metaTag},`);
        await locator.click();
        await locator.getByLabel("publish at", {}).fill(publishAtDateTimeLocal);
        await locator
            .locator(".management-blog-entry-body-markdown-editor")
            .getByRole("textbox")
            .fill(bodyMarkdown);

        await context.route(
            "*/**/blog-entry/publish",
            async (route, request) => {
                const postData = request.postDataJSON();
                expect(postData).toBeDefined();

                console.log("postData", postData);

                const {
                    title: requestTitle,
                    slug: requestSlug,
                    bodyMarkdown: requestBodyMarkdown,
                    publishAt: requestPublishAt,
                    blogEntryMetaTagNames: requestBlogEntryMetaTagNames,
                } = postData! as components["schemas"]["PublishBlogEntryRequest"];
                expect(requestTitle).toBe(title);
                expect(requestSlug).toBe(slug);
                expect(requestBodyMarkdown.trim()).toBe(bodyMarkdown);
                expect(requestPublishAt).toBe(publishAtDateTimeLocal);
                expect(requestBlogEntryMetaTagNames.at(0)).toBe(metaTag);

                return route.fulfill({
                    status: 200,
                });
            },
        );

        await locator
            .getByRole("button", {
                name: "publish",
            })
            .click();
    });
});
