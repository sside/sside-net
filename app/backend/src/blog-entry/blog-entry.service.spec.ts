import { Test, TestingModule } from "@nestjs/testing";
import { BlogEntryService } from "./blog-entry.service";
import { prepareTestDatabase } from "../library/test/database/prepareTestDatabase";
import { DatabaseModule } from "../database/database.module";
import { BlogEntryQuery } from "./query/blog-entry.query";

describe("BlogEntryService", () => {
    let blogEntryService: BlogEntryService;

    beforeEach(async () => {
        prepareTestDatabase();
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [BlogEntryService, BlogEntryQuery],
        }).compile();

        blogEntryService = module.get<BlogEntryService>(BlogEntryService);
    });

    test("Blog Entryを作成、取得できること。", async () => {
        const created = await blogEntryService.createOneDraft({
            title: "title",
            slug: "slug",
            bodyMarkdown: "this is body markdown",
            metaTagIds: [],
        });
        const fetched = await blogEntryService.findOneById(created.id);

        expect(created.slug).toEqual(fetched.slug);
    });
});
