import { Test, TestingModule } from "@nestjs/testing";
import { prepareTestDatabase } from "../library/test/prepareTestDatabase";
import { LoggerModule } from "../logger/logger.module";
import { DatabaseService } from "./database.service";

describe("DatabaseService", () => {
    let service: DatabaseService;

    beforeEach(async () => {
        prepareTestDatabase();

        const module: TestingModule = await Test.createTestingModule({
            imports: [LoggerModule],
            providers: [DatabaseService],
        }).compile();

        service = module.get<DatabaseService>(DatabaseService);
    });

    test("接続が行えること。", async () => {
        expect(await service.$executeRawUnsafe(`SELECT 1`)).toBe(1);
    });

    test("トランザクション失敗時にROLLBACKされること。", async () => {
        const SLUG = "test_slug";
        const { id } = await service.blogEntry.create({
            data: {
                slug: SLUG,
            },
        });

        try {
            await service.transaction(async (transaction) => {
                transaction.blogEntry.update({
                    where: {
                        id,
                    },
                    data: {
                        slug: SLUG + "aaa",
                    },
                });
                transaction.blogEntryDraft.create({
                    data: {
                        blogEntryId: id,
                        title: "title",
                        bodyMarkdown: "bodyMarkdown",
                    },
                });

                throw new Error("意図的なエラー");
            });
            // 意図的なエラーを起こしているため無視
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}

        const entry = await service.blogEntry.findUnique({
            where: {
                id,
            },
            include: {
                blogEntryDraft: true,
            },
        });

        expect(entry?.slug).toBe(SLUG);
        expect(entry?.blogEntryDraft).toBeFalsy();
    });
});
