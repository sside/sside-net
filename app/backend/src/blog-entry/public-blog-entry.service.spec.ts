import { fakerEN, fakerJA } from "@faker-js/faker";
import { beforeEach, describe, expect, test, jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { createIntegerRange } from "@sside-net/utility";
import { DatabaseModule } from "../database/database.module";
import { prepareTestDatabase } from "../library/test/database/prepareTestDatabase";
import { BlogEntryModule } from "./blog-entry.module";
import { BlogEntryService } from "./blog-entry.service";
import { PublicBlogEntryService } from "./public-blog-entry.service";
import { BlogEntryInput } from "./type/BlogEntryInput";

describe("PublicBlogEntryService", () => {
    let publicBlogEntryService: PublicBlogEntryService;
    let blogEntryService: BlogEntryService;

    const createBlogEntryInput = (
        overWrite?: Partial<BlogEntryInput>,
    ): BlogEntryInput => ({
        slug: fakerEN.lorem.slug(),
        title: fakerJA.book.title(),
        bodyMarkdown: fakerJA.lorem.text(),
        ...overWrite,
    });

    beforeEach(async () => {
        expect.hasAssertions();
        prepareTestDatabase();

        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, BlogEntryModule],
        }).compile();

        publicBlogEntryService = module.get<PublicBlogEntryService>(
            PublicBlogEntryService,
        );
        blogEntryService = module.get<BlogEntryService>(BlogEntryService);
    });

    describe("getLatestPublishedBlogEntries", () => {
        test("指定した件数の公開済みBlogEntryが取得できること。", async () => {
            await blogEntryService.seed(5, 2, 0);

            const SEARCH_COUNT = 3;
            expect(
                (
                    await publicBlogEntryService.getLatestBlogEntries(
                        SEARCH_COUNT,
                    )
                ).length,
            ).toBe(SEARCH_COUNT);
        });

        test("指定した件数以下のBlogEntryしかない場合、取得できた分のみ返すこと。", async () => {
            const PUBLISH_COUNT = 5;

            await blogEntryService.seed(PUBLISH_COUNT, 2, 0);

            expect(
                (await publicBlogEntryService.getLatestBlogEntries(10)).length,
            ).toBe(PUBLISH_COUNT);
        });

        test("ポインターのBlogEntryIdを指定した場合、ポインターで指定したものと、指定より過去のBlogEntryを取得できること。", async () => {
            const [createdBlogEntries] = await blogEntryService.seed(10, 2, 0);
            const pointerBlogEntry = createdBlogEntries.at(4)!;

            const foundBlogEntries =
                await publicBlogEntryService.getLatestBlogEntries(
                    5,
                    pointerBlogEntry.id,
                );

            expect(
                foundBlogEntries.find(({ id }) => id === pointerBlogEntry.id),
            ).toBeDefined();
            for (const { publishAt } of foundBlogEntries) {
                expect(publishAt!.getTime()).toBeLessThanOrEqual(
                    pointerBlogEntry.publishAt!.getTime(),
                );
            }
        });

        test("公開済みBlogEntryがない場合は空配列を返すこと。", async () => {
            expect(
                (await publicBlogEntryService.getLatestBlogEntries(10)).length,
            ).toBe(0);
        });
    });

    describe("getPublishedBlogEntriesByPublishYear", () => {
        test("取得した公開済みBlogEntryが指定した年度のもののみであること。", async () => {
            const PUBLISH_COUNT = 10;
            const startOfYear = new Date("2026-01-01T00:00:00+09:00");
            const endOfYear = new Date("2026-12-31T23:59:59+09:00");

            await Promise.all(
                createIntegerRange(1, PUBLISH_COUNT)
                    .map(() => createBlogEntryInput())
                    .map(
                        async (blogEntryInput) =>
                            await blogEntryService.createPublished(
                                blogEntryInput,
                                [],
                                fakerEN.date
                                    .betweens({
                                        from: startOfYear,
                                        to: endOfYear,
                                        count: 1,
                                    })
                                    .at(0),
                            ),
                    ),
            );
            await Promise.all(
                createIntegerRange(1, PUBLISH_COUNT)
                    .map(() => createBlogEntryInput())
                    .map(
                        async (blogEntryInput) =>
                            await blogEntryService.createPublished(
                                blogEntryInput,
                                [],
                                fakerEN.date.future({
                                    years: 2027,
                                }),
                            ),
                    ),
            );

            const publishedBlogEntries =
                await publicBlogEntryService.getBlogEntriesByPublishYear(
                    2026,
                    PUBLISH_COUNT,
                );

            for (const { publishAt } of publishedBlogEntries) {
                expect(publishAt?.getTime()).toBeGreaterThanOrEqual(
                    startOfYear.getTime(),
                );
                expect(publishAt?.getTime()).toBeLessThanOrEqual(
                    endOfYear.getTime(),
                );
            }
        });

        test("指定の日付範囲で作成した公開済みBlogEntryの件数が作成件数と一致すること。", async () => {
            const PUBLISH_COUNT = 10;
            const startOfYear = new Date("2025-01-01T00:00:00+09:00");
            const endOfYear = new Date("2025-12-31T23:59:59+09:00");

            await Promise.all(
                createIntegerRange(1, PUBLISH_COUNT)
                    .map(() => createBlogEntryInput())
                    .map(
                        async (blogEntryInput) =>
                            await blogEntryService.createPublished(
                                blogEntryInput,
                                [],
                                fakerEN.date
                                    .betweens({
                                        from: startOfYear,
                                        to: endOfYear,
                                        count: 1,
                                    })
                                    .at(0),
                            ),
                    ),
            );
            await Promise.all(
                createIntegerRange(1, PUBLISH_COUNT)
                    .map(() => createBlogEntryInput())
                    .map(
                        async (blogEntryInput) =>
                            await blogEntryService.createPublished(
                                blogEntryInput,
                                [],
                                fakerEN.date.future({
                                    years: 2027,
                                }),
                            ),
                    ),
            );

            const publishedBlogEntries =
                await publicBlogEntryService.getBlogEntriesByPublishYear(
                    2025,
                    PUBLISH_COUNT * 100,
                );

            expect(publishedBlogEntries.length).toBe(PUBLISH_COUNT);
        });

        test("取得時点で公開日に達していないBlogEntryを取得しないこと。", async () => {
            const halfOfYear = new Date("2026-07-01T00:00:00+09:00");
            jest.useFakeTimers({
                now: halfOfYear,
                // FIXME: タイムアウト対策のためにdoNotFakeを入れている。
                // https://zenn.dev/kterui9019/scraps/9dfb7c79919f70
                doNotFake: [
                    "nextTick",
                    "setImmediate",
                    "clearImmediate",
                    "setInterval",
                    "clearInterval",
                    "setTimeout",
                    "clearTimeout",
                ],
            });

            const PUBLISH_COUNT = 5;
            const startOfYear = new Date("2026-01-01T00:00:00+09:00");
            const endOfYear = new Date("2026-12-31T23:59:59+09:00");

            await Promise.all(
                createIntegerRange(1, PUBLISH_COUNT)
                    .map(() => createBlogEntryInput())
                    .map(
                        async (blogEntryInput) =>
                            await blogEntryService.createPublished(
                                blogEntryInput,
                                [],
                                fakerEN.date
                                    .betweens({
                                        from: startOfYear,
                                        to: halfOfYear,
                                        count: 1,
                                    })
                                    .at(0),
                            ),
                    ),
            );
            await Promise.all(
                createIntegerRange(1, PUBLISH_COUNT)
                    .map(() => createBlogEntryInput())
                    .map(
                        async (blogEntryInput) =>
                            await blogEntryService.createPublished(
                                blogEntryInput,
                                [],
                                fakerEN.date
                                    .betweens({
                                        from: halfOfYear,
                                        to: endOfYear,
                                        count: 1,
                                    })
                                    .at(0),
                            ),
                    ),
            );

            const publishedBlogEntries =
                await publicBlogEntryService.getBlogEntriesByPublishYear(
                    2026,
                    PUBLISH_COUNT * 100,
                );

            expect(publishedBlogEntries.length).toBe(PUBLISH_COUNT);
        });

        test("検索対象がない場合はNotFoundExceptionを投げること。", async () => {
            await blogEntryService.createPublished(
                createBlogEntryInput(),
                [],
                new Date("2027-01-01T00:00:00+09:00"),
            );

            await expect(
                publicBlogEntryService.getBlogEntriesByPublishYear(2026, 1),
            ).rejects.toThrow(/検索日時範囲/);
        });
    });

    describe("getPublishedBlogEntriesByPublishYearMonth", () => {
        test("取得した公開済みBlogEntryが指定した年月のもののみであること。", async () => {
            const PUBLISH_COUNT = 10;
            const startOfMonth = new Date("2026-01-01T00:00:00+09:00");
            const endOfMonth = new Date("2026-01-31T23:59:59+09:00");

            await Promise.all(
                createIntegerRange(1, PUBLISH_COUNT)
                    .map(() => createBlogEntryInput())
                    .map(
                        async (blogEntryInput) =>
                            await blogEntryService.createPublished(
                                blogEntryInput,
                                [],
                                fakerEN.date
                                    .betweens({
                                        from: startOfMonth,
                                        to: endOfMonth,
                                        count: 1,
                                    })
                                    .at(0),
                            ),
                    ),
            );
            await Promise.all(
                createIntegerRange(1, PUBLISH_COUNT)
                    .map(() => createBlogEntryInput())
                    .map(
                        async (blogEntryInput) =>
                            await blogEntryService.createPublished(
                                blogEntryInput,
                                [],
                                fakerEN.date.future({
                                    refDate: new Date(
                                        "2026-02-02T00:00:00+09:00",
                                    ),
                                }),
                            ),
                    ),
            );

            const publishedBlogEntries =
                await publicBlogEntryService.getBlogEntriesByPublishYearMonth(
                    2026,
                    1,
                    PUBLISH_COUNT,
                );

            for (const { publishAt } of publishedBlogEntries) {
                expect(publishAt?.getTime()).toBeGreaterThanOrEqual(
                    startOfMonth.getTime(),
                );
                expect(publishAt?.getTime()).toBeLessThanOrEqual(
                    endOfMonth.getTime(),
                );
            }
        });

        test("検索対象がない場合はNotFoundExceptionを投げること。", async () => {
            await blogEntryService.createPublished(
                createBlogEntryInput(),
                [],
                new Date("2027-01-01T00:00:00+09:00"),
            );

            await expect(
                publicBlogEntryService.getBlogEntriesByPublishYearMonth(
                    2026,
                    1,
                    1,
                ),
            ).rejects.toThrow(/検索日時範囲/);
        });
    });

    describe("getAllPublishedBlogEntriesCreatedAt", () => {
        test("公開されたBlogEntryのpublishAtを全て取得できること。", async () => {
            const [publishedBlogEntries] = await blogEntryService.seed(
                10,
                2,
                10,
            );

            const publishAts = await publicBlogEntryService.getAllPublishAt();

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

            for (let index = 0; index < FUTURE_ENTRY_COUNT; index++) {
                await blogEntryService.setPublishAt(
                    publishedBlogEntries.at(index)!.id,
                    fakerEN.date.future({
                        years: 10,
                    }),
                );
            }

            expect(
                (await publicBlogEntryService.getAllPublishAt()).length,
            ).toBe(CREATE_COUNT - FUTURE_ENTRY_COUNT);
        });
    });
});
