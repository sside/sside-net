import { describe, test, expect, beforeEach } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { prepareTestDatabase } from "../library/test/database/prepareTestDatabase";
import { DatabaseService } from "./database.service";

describe("DatabaseService", () => {
    let databaseService: DatabaseService;

    beforeEach(async () => {
        prepareTestDatabase({});

        const module: TestingModule = await Test.createTestingModule({
            providers: [DatabaseService],
        }).compile();

        databaseService = module.get<DatabaseService>(DatabaseService);
    });

    test("DBに接続できること。", async () => {
        await expect(databaseService.$connect()).resolves.not.toThrow();
    });

    describe("transaction", () => {
        test("TRANSACTIONが完了した場合、データが永続化されていること。", async () => {
            const slug = "foo";
            await databaseService.transaction(async (transactionClient) => {
                await transactionClient.blogEntry.create({
                    data: {
                        slug,
                        blogEntryDraft: {
                            create: {
                                title: "title",
                                bodyMarkdown: "body",
                            },
                        },
                    },
                });
            });
            expect((await databaseService.blogEntry.findFirst())?.slug).toBe(
                slug,
            );
        });

        test("TRANSACTION中に例外が投げられた場合、変更がROLLBACKされること。", async () => {
            const foo = "foo",
                bar = "bar",
                baz = "baz";

            const { id } = await databaseService.blogEntry.create({
                data: {
                    slug: foo,
                    blogEntryDraft: {
                        create: {
                            title: "title",
                            bodyMarkdown: "body",
                        },
                    },
                },
            });

            try {
                await databaseService.transaction(async (transactionClient) => {
                    transactionClient.blogEntry.update({
                        where: {
                            id,
                        },
                        data: {
                            slug: bar,
                        },
                    });
                    transactionClient.blogEntry.create({
                        data: {
                            slug: baz,
                            blogEntryDraft: {
                                create: {
                                    title: "title",
                                    bodyMarkdown: "body",
                                },
                            },
                        },
                    });

                    throw new Error();
                });
            } catch (e) {
                // ROLLBACKのためのエラーなので握り潰す
            }

            const records = await databaseService.blogEntry.findMany();
            expect(records.length).toBe(1);
            expect(records.find(({ slug }) => slug === foo)).toBeTruthy();
            expect(records.find(({ slug }) => slug === bar)).toBeUndefined();
            expect(records.find(({ slug }) => slug === baz)).toBeUndefined();
        });
    });
});
