import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { createIntegerRange } from "@sside-net/utility";
import { prepareTestDatabase } from "../library/test/database/prepareTestDatabase";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import { BlogEntryModule } from "./blog-entry.module";
import { BlogEntryService } from "./blog-entry.service";

describe("BlogEntryMetaTagService", () => {
    let blogEntryService: BlogEntryService;
    let blogEntryMetaTagService: BlogEntryMetaTagService;

    beforeEach(async () => {
        expect.hasAssertions();
        prepareTestDatabase();

        const module: TestingModule = await Test.createTestingModule({
            imports: [BlogEntryModule],
        }).compile();

        blogEntryService = module.get(BlogEntryService);
        blogEntryMetaTagService = module.get(BlogEntryMetaTagService);
    });

    describe("getAllPublishedBlogEntryMetaTags", () => {
        test("全ての公開済みBlogEntryに紐づいているBlogEntryMetaTagが取得できること。", async () => {
            const [blogEntries] = await blogEntryService.seed(10, 2, 5);
            const publishedBlogEntryMetaTags =
                await blogEntryMetaTagService.getAllPublishedBlogEntryMetaTags();

            const createdMetaTagIds = blogEntries
                .flatMap(({ blogEntryMetaTags }) => blogEntryMetaTags)
                .map(({ id }) => id);
            for (const { id } of publishedBlogEntryMetaTags) {
                expect(createdMetaTagIds.includes(id)).toBe(true);
            }
        });
    });

    const sampleMetaTagName = "sample meta tag name";
    describe("getOrCreateByName", () => {
        test("存在しないmetaTagNameを与えられた場合、新規で作成されること。", async () => {
            expect(
                (await blogEntryMetaTagService.seed(10)).map(
                    ({ name }) => name,
                ),
            ).not.toContain(sampleMetaTagName);

            const created =
                await blogEntryMetaTagService.getOrCreateByName(
                    sampleMetaTagName,
                );
            const allMetaTags =
                await blogEntryMetaTagService.getAllBlogEntryMetaTags();
            expect(allMetaTags.map(({ name }) => name)).toContain(created.name);
            expect(allMetaTags.map(({ id }) => id)).toContain(created.id);
        });

        test("既に存在するmetaTagNameを与えられた場合、既存のレコードを返すこと。", async () => {
            const created =
                await blogEntryMetaTagService.getOrCreateByName(
                    sampleMetaTagName,
                );

            expect(
                (await blogEntryMetaTagService.getAllBlogEntryMetaTags()).map(
                    ({ name }) => name,
                ),
            ).toContain(created.name);
            expect(
                (
                    await blogEntryMetaTagService.getOrCreateByName(
                        sampleMetaTagName,
                    )
                ).id,
            ).toBe(created.id);
        });
    });

    describe("getOrCreateByNames", () => {
        test("複数のBlogEntryMetaTagを挿入出来ていること。", async () => {
            const first = createIntegerRange(1, 5).map(() =>
                faker.lorem.slug(1),
            );
            const second = createIntegerRange(1, 5).map(() =>
                faker.lorem.slug(1),
            );

            await blogEntryMetaTagService.getOrCreateByNames(first);
            const firstCreated = (
                await blogEntryMetaTagService.getAllBlogEntryMetaTags()
            ).map(({ name }) => name);

            for (const metaTagName of first) {
                expect(firstCreated).toContain(metaTagName);
            }
            for (const metaTagName of second) {
                expect(firstCreated).not.toContain(metaTagName);
            }

            await blogEntryMetaTagService.getOrCreateByNames(second);
            const secondCreated = (
                await blogEntryMetaTagService.getAllBlogEntryMetaTags()
            ).map(({ name }) => name);
            for (const metaTagName of [...first, ...second]) {
                expect(secondCreated).toContain(metaTagName);
            }
        });
    });

    describe("updateName", () => {
        test("同じidのレコードのnameを変更できていること。", async () => {
            const { id: createdId, name: createdName } =
                await blogEntryMetaTagService.getOrCreateByName(
                    sampleMetaTagName,
                );

            const updateValue = faker.lorem.slug(1);
            await blogEntryMetaTagService.updateName(createdId, updateValue);

            const { id: updatedId, name: updatedName } =
                await blogEntryMetaTagService.getOrCreateByName(updateValue);

            expect(updatedId).toBe(createdId);
            expect(updatedName).toBe(updateValue);
            expect(updatedName).not.toBe(createdName);
        });
    });
});
