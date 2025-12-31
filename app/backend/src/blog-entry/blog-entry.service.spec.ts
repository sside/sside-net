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
        expect.hasAssertions();
        prepareTestDatabase();

        const module: TestingModule = await Test.createTestingModule({
            imports: [BlogEntryModule],
        }).compile();
        module.useLogger(new JsonLogger("BlogEntryService"));

        blogEntryService = module.get<BlogEntryService>(BlogEntryService);
    });

    describe("getByBlogEntryId", () => {
        test("存在するidでBlogEntryを取得できること。", async () => {
            const [publishedBlogEntries] = await blogEntryService.seed(1, 1, 0);
            const seeded = publishedBlogEntries.at(0)!;

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

    describe("getByBlogEntryIds", () => {
        test("複数指定した全てのBlogEntryが取得できること。", async () => {
            const [publishedBlogEntries, draftBlogEntries] =
                await blogEntryService.seed(5, 2, 5);

            const createdIds = [
                ...publishedBlogEntries,
                ...draftBlogEntries,
            ].map(({ id }) => id);
            const foundedBlogEntries =
                await blogEntryService.getByBlogEntryIds(createdIds);

            for (const createdId of createdIds) {
                expect(
                    foundedBlogEntries.find(({ id }) => id === createdId),
                ).toBeTruthy();
            }
        });

        test("isCheckContainsAllBlogEntryオプションを指定した場合に、存在しないIDを取得しようとするとエラーになること。", async () => {
            await blogEntryService.seed(1, 1, 1);

            await expect(
                blogEntryService.getByBlogEntryIds([1, 2]),
            ).resolves.toBeTruthy();
            await expect(
                blogEntryService.getByBlogEntryIds([1, 2, 100]),
            ).rejects.toThrow(/見つからなかった/);
        });

        test("空配列を指定した場合空の配列が返ること。", async () => {
            await blogEntryService.seed(1, 1, 1);

            expect((await blogEntryService.getByBlogEntryIds([])).length).toBe(
                0,
            );
        });
    });

    describe("getAllPublishedBlogEntriesCreatedAt", () => {
        test("公開されたBlogEntryのpublishAtを全て取得できること。", async () => {
            const [publishedBlogEntries] = await blogEntryService.seed(
                10,
                2,
                10,
            );

            const publishAts =
                await blogEntryService.getAllBlogEntriesPublishAt();

            for (const { publishAt } of publishedBlogEntries) {
                if (!publishAt) {
                    continue;
                }

                expect(
                    publishAts.some(
                        (gotPublishAt) =>
                            gotPublishAt.getTime() === publishAt.getTime(),
                    ),
                ).toBe(true);
            }
        });
        test("公開日が将来のものは取得していないこと。", async () => {
            const CREATE_COUNT = 5;
            const FUTURE_ENTRY_COUNT = 3;
            const [publishedBlogEntries] = await blogEntryService.seed(
                CREATE_COUNT,
                3,
                0,
            );

            for (let i = 0; i < FUTURE_ENTRY_COUNT; i++) {
                await blogEntryService.setPublishAt(
                    publishedBlogEntries.at(i)!.id,
                    faker.date.future({
                        years: 10,
                    }),
                );
            }

            expect(
                (await blogEntryService.getAllBlogEntriesPublishAt()).length,
            ).toBe(CREATE_COUNT - FUTURE_ENTRY_COUNT);
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
            const { id, blogEntryHistories: createdBlogEntryHistories } = (
                await blogEntryService.seed(1, 1, 0)
            )
                .at(0)!
                .at(0)!;

            const historyCount = createdBlogEntryHistories.length;

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
            const { id } = (await blogEntryService.seed(1, 1, 0)).at(0)!.at(0)!;

            const updateValue = new Date("2025-06-01T00:00:00+09:00");
            const { publishAt: updatedPublishAt } =
                await blogEntryService.setPublishAt(id, updateValue);

            expect(updatedPublishAt?.getTime()).toBe(updateValue.getTime());
        });
        test("nullを渡した場合、公開日を削除できること。", async () => {
            const { id } = (await blogEntryService.seed(1, 1, 0)).at(0)!.at(0)!;

            const { publishAt } = await blogEntryService.setPublishAt(id, null);
            expect(publishAt).toBeNull();
        });
    });

    describe("setRelatedBlogEntryMetaTagsByName", () => {
        test("BlogEntryMetaTagの紐づけが行えること。", async () => {
            const { id, blogEntryMetaTags: firstBlogEntryMetaTags } =
                await blogEntryService.createPublished(createBlogEntryInput());

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
            const { id, blogEntryMetaTags: firstMetaTags } =
                await blogEntryService.createPublished(createBlogEntryInput());

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
