import { faker, fakerJA } from "@faker-js/faker";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { createIntegerArray } from "@sside-net/utility";
import { JsonLogger } from "../library/logger/JsonLogger";
import { prepareTestDatabase } from "../library/test/database/prepareTestDatabase";
import { BlogEntryModule } from "./blog-entry.module";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryInput } from "./type/BlogEntryInput";

describe("BlogEntryService", () => {
    let blogEntryService: BlogEntryService;

    const createBlogEntryInput = (
        overWrite?: Partial<BlogEntryInput>,
    ): BlogEntryInput => ({
        ...{
            slug: faker.lorem.slug(),
            title: fakerJA.book.title(),
            bodyMarkdown: fakerJA.lorem.text(),
        },
        ...overWrite,
    });

    const createMetaTagNames = (min = 1, max = 6) =>
        createIntegerArray(
            faker.number.int({
                min,
                max,
            }),
        ).map(() => faker.lorem.slug(2));

    beforeEach(async () => {
        prepareTestDatabase();

        const module: TestingModule = await Test.createTestingModule({
            imports: [BlogEntryModule],
        }).compile();
        module.useLogger(new JsonLogger("BlogEntryService"));

        blogEntryService = module.get<BlogEntryService>(BlogEntryService);
    });

    describe("getByBlogEntryId", () => {
        test("存在するidでBlogEntryを取得できること。", async () => {
            const [published] = await blogEntryService.seed(1, 0, 0);
            const seeded = published.at(0)!;

            expect(
                (await blogEntryService.getByBlogEntryId(seeded.id)).slug,
            ).toBe(seeded.slug);
        });

        test("存在しないidで取得を試みた場合、NotFoundが投げられること。", async () => {
            await expect(
                blogEntryService.getByBlogEntryId(Number.MAX_SAFE_INTEGER),
            ).rejects.toThrow(/BlogEntryが見つかりませんでした/);
        });
    });

    describe("createDraft", () => {
        test("blogEntryDraftを含むBlogEntryを作成できること。", async () => {
            const blogEntryInput = createBlogEntryInput();

            const { blogEntryDraft } =
                await blogEntryService.createDraft(blogEntryInput);

            expect(blogEntryDraft?.title).toBe(blogEntryInput.title);
            expect(blogEntryDraft?.bodyMarkdown).toBe(
                blogEntryInput.bodyMarkdown,
            );
        });
    });

    describe("updateDraft", () => {
        test("BlogEntryに下書きがある場合、更新できること。", async () => {
            const { id, blogEntryDraft } = await blogEntryService.createDraft(
                createBlogEntryInput(),
            );
            const createdDraftBody = blogEntryDraft?.bodyMarkdown;
            const createdDraftTitle = blogEntryDraft?.title;

            const updatedDraft = await blogEntryService.updateDraft(
                id,
                createBlogEntryInput(),
            );

            expect(updatedDraft.blogEntryDraft?.title).not.toBe(
                createdDraftTitle,
            );
            expect(updatedDraft.blogEntryDraft?.bodyMarkdown).not.toBe(
                createdDraftBody,
            );
        });

        test("BlogEntryに下書きがない場合、作成して紐づけできること。", async () => {
            const { id } = await blogEntryService.createPublished(
                createBlogEntryInput(),
            );

            const draftInput = createBlogEntryInput();
            const { blogEntryDraft } = await blogEntryService.updateDraft(
                id,
                draftInput,
            );

            expect(blogEntryDraft?.bodyMarkdown).toBe(draftInput.bodyMarkdown);
        });
    });

    describe("createPublishedBlogEntry", () => {
        test("1つ以上の公開履歴を含むBlogEntryを作成できること。", async () => {
            const { id } = await blogEntryService.createPublished(
                createBlogEntryInput(),
            );

            expect(
                (await blogEntryService.getByBlogEntryId(id)).blogEntryHistories
                    .length,
            ).toBeGreaterThanOrEqual(1);
        });
    });

    describe("publishBlogEntryDraft", () => {
        test("BlogEntryの下書きを公開履歴に移行できること。", async () => {
            const { id, blogEntryDraft } = await blogEntryService.createDraft(
                createBlogEntryInput(),
            );

            expect(blogEntryDraft).toBeDefined();

            const { blogEntryHistories } =
                await blogEntryService.publishBlogEntryDraft(id);
            expect(blogEntryHistories.length).toBeGreaterThanOrEqual(1);
        });

        test("下書きの紐づけがない場合エラーを投げること。", async () => {
            const { id, blogEntryDraft } =
                await blogEntryService.createPublished(createBlogEntryInput());

            expect(blogEntryDraft).toBeNull();
            await expect(
                blogEntryService.publishBlogEntryDraft(id),
            ).rejects.toThrow(/Draft/);
        });
    });

    describe("addBlogEntryHistory", () => {
        test("既存の公開済みBlogEntryに公開履歴を追加できること。", async () => {
            const HISTORY_COUNT = 5;
            const { id, blogEntryHistories: createdBlogEntryHistories } = (
                await blogEntryService.seed(1, HISTORY_COUNT, 0)
            )
                .at(0)!
                .at(0)!;

            const historyCount = createdBlogEntryHistories.length;
            expect(historyCount).toBe(HISTORY_COUNT + 1);

            const inputItem = createBlogEntryInput();
            const { blogEntryHistories: addedBlogEntryHistories } =
                await blogEntryService.addBlogEntryHistory(id, inputItem);
            expect(addedBlogEntryHistories.length).toBe(historyCount + 1);
            expect(
                addedBlogEntryHistories
                    .toSorted(
                        (
                            { createdAt: aCreatedAt },
                            { createdAt: bCreatedAt },
                        ) => aCreatedAt.getTime() - bCreatedAt.getTime(),
                    )
                    .at(-1)?.bodyMarkdown,
            ).toBe(inputItem.bodyMarkdown);
        });
    });

    describe("setPublishAt", () => {
        test("既存のBlogEntryに公開日を設定できること。", async () => {
            const { id, publishAt } = (await blogEntryService.seed(1, 0, 0))
                .at(0)!
                .at(0)!;

            const updateValue = new Date("2025-06-01T00:00:00+09:00");
            expect(publishAt?.getTime()).not.toBe(updateValue.getTime());

            const { publishAt: updatedPublishAt } =
                await blogEntryService.setPublishAt(id, updateValue);

            expect(updatedPublishAt?.getTime()).toBe(updateValue.getTime());
        });
    });

    describe("setRelatedBlogEntryMetaTagsByName", () => {
        test("BlogEntryMetaTagの紐づけが行えること。", async () => {
            const { id, blogEntryMetaTags: firstBlogEntryMetaTags } = (
                await blogEntryService.seed(1, 0, 0)
            )
                .at(0)!
                .at(0)!;

            expect(firstBlogEntryMetaTags.length).toBe(0);

            const metaTagNames = createMetaTagNames();
            const { blogEntryMetaTags: appliedBlogEntryMetaTags } =
                await blogEntryService.setRelatedBlogEntryMetaTagsByName(
                    id,
                    metaTagNames,
                );

            expect(appliedBlogEntryMetaTags.length).toBeGreaterThan(0);
            const appliedMetaTagNames = appliedBlogEntryMetaTags.map(
                ({ name }) => name,
            );
            for (const metaTagName of metaTagNames) {
                expect(appliedMetaTagNames).toContain(metaTagName);
            }
        });

        test("引数に渡したBlogEntryMetaTagのみが紐づけされること。", async () => {
            const { id, blogEntryMetaTags: firstMetaTags } = (
                await blogEntryService.seed(1, 0, 0)
            )
                .at(0)!
                .at(0)!;

            expect(firstMetaTags.length).toBe(0);

            const secondMetaTagNames = createMetaTagNames(10, 10);
            const { blogEntryMetaTags: secondMetaTags } =
                await blogEntryService.setRelatedBlogEntryMetaTagsByName(
                    id,
                    secondMetaTagNames,
                );

            expect(secondMetaTags.map(({ name }) => name)).toEqual(
                expect.arrayContaining(secondMetaTagNames),
            );

            const updateMetaTagNames = createMetaTagNames(3, 3);
            const { blogEntryMetaTags: updatedMetaTags } =
                await blogEntryService.setRelatedBlogEntryMetaTagsByName(
                    id,
                    updateMetaTagNames,
                );

            expect(updatedMetaTags.length).toBe(updateMetaTagNames.length);
            expect(updatedMetaTags.map(({ name }) => name)).toEqual(
                expect.arrayContaining(updateMetaTagNames),
            );
        });
    });
});
