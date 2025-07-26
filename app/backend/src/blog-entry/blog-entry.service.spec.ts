import { faker, fakerJA } from "@faker-js/faker";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "../database/database.module";
import { prepareTestDatabase } from "../library/test/database/prepareTestDatabase";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryQuery } from "./query/blog-entry.query";
import { BlogEntryInput } from "./type/BlogEntryInput";

describe("BlogEntryService", () => {
    let blogEntryService: BlogEntryService;

    const createBlogEntryInput = (): BlogEntryInput => ({
        slug: faker.lorem.slug(),
        title: fakerJA.book.title(),
        bodyMarkdown: fakerJA.lorem.text(),
    });

    beforeEach(async () => {
        prepareTestDatabase();

        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [BlogEntryService, BlogEntryQuery],
        }).compile();

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
            const { id, slug, blogEntryDraft } =
                await blogEntryService.createDraft(createBlogEntryInput());
            const createdDraftBody = blogEntryDraft?.bodyMarkdown;
            const createdDraftTitle = blogEntryDraft?.title;

            const updatedDraft = await blogEntryService.updateDraft(id, {
                slug,
                title: createdDraftTitle!,
                bodyMarkdown: fakerJA.lorem.text(),
            });

            expect(updatedDraft.blogEntryDraft?.title).toBe(createdDraftTitle);
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
        test("1つ以上の公開履歴を含むBlogEntryを作成できること。", async () => {});
    });

    describe("publishBlogEntryDraft", () => {
        test("BlogEntryの下書きを公開履歴に移行できること。", async () => {});

        test("下書きの紐づけがない場合エラーを投げること。", async () => {});
    });

    describe("addBlogEntryHistory", () => {
        test("既存の公開済みBlogEntryに公開履歴を追加できること。", async () => {});
    });

    describe("setPublishAt", () => {
        test("既存のBlogEntryに公開日を設定できること。", async () => {});
    });
});
