import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "../database/database.module";
import { prepareTestDatabase } from "../library/test/prepareTestDatabase";
import { LoggerModule } from "../logger/logger.module";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryDraftQuery } from "./query/blog-entry-draft.query";
import { BlogEntryHistoryQuery } from "./query/blog-entry-history.query";
import { BlogEntryQuery } from "./query/blog-entry.query";

describe("BlogEntryService", () => {
    let blogEntryService: BlogEntryService;

    beforeEach(async () => {
        prepareTestDatabase();

        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, LoggerModule],
            providers: [
                BlogEntryService,
                BlogEntryQuery,
                BlogEntryHistoryQuery,
                BlogEntryDraftQuery,
            ],
        }).compile();

        blogEntryService = module.get<BlogEntryService>(BlogEntryService);
    });

    test("エントリを作成、取得が行えること。", async () => {
        const { id } = (await blogEntryService.seed(1))[0][0];
        const found = await blogEntryService.getById(id);
        expect(id).toBe(found.id);
    });

    describe("公開エントリ", () => {
        test("publishAtプロパティがあること。", async () => {
            const publishedBlogEntry = await blogEntryService.getById(
                (await blogEntryService.seed(1))[0][0].id,
            );

            expect(publishedBlogEntry.publishAt).toBeTruthy();
        });
        test("履歴が1つ以上あること。", async () => {
            const publishedBlogEntry = await blogEntryService.getById(
                (await blogEntryService.seed(1))[0][0].id,
            );

            expect(
                publishedBlogEntry.blogEntryHistories?.length,
            ).toBeGreaterThanOrEqual(1);
        });
    });
});
