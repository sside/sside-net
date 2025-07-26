import { faker, fakerJA } from "@faker-js/faker";
import {
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
    BlogEntryQuery,
    BlogEntryWithRelations,
} from "./query/blog-entry.query";
import { BlogEntryInput } from "./type/BlogEntryInput";

@Injectable()
export class BlogEntryService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly blogEntryQuery: BlogEntryQuery) {}

    async getByBlogEntryId(
        blogEntryId: number,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("idからBlogEntryを取得します。", {
            blogEntryId,
            ongoingTransaction: !!ongoingTransaction,
        });

        const blogEntry =
            await this.blogEntryQuery.findOneWithRelationsByBlogEntryId(
                blogEntryId,
                ongoingTransaction,
            );

        if (blogEntry === null) {
            throw new NotFoundException(
                `BlogEntryが見つかりませんでした。blogEntryId: ${blogEntryId}`,
            );
        }

        return blogEntry;
    }

    async createDraft(
        blogEntryInput: BlogEntryInput,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("BlogEntryの下書きを作成します。", {
            blogEntryInput: {
                ...blogEntryInput,
                bodyMarkdown: blogEntryInput.bodyMarkdown.length,
            },
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.getByBlogEntryId(
            (
                await this.blogEntryQuery.insertDraft(
                    blogEntryInput,
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async updateDraft(
        blogEntryId: number,
        blogEntryInput: BlogEntryInput,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("BlogEntryの下書きを更新します。", {
            blogEntryId,
            blogEntryInput: {
                ...blogEntryInput,
                bodyMarkdown: blogEntryInput.bodyMarkdown.length,
            },
            ongoingTransaction: !!ongoingTransaction,
        });

        // 存在チェック
        await this.getByBlogEntryId(blogEntryId, ongoingTransaction);

        return await this.getByBlogEntryId(
            (
                await this.blogEntryQuery.updateDraft(
                    blogEntryId,
                    blogEntryInput,
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async createPublished(
        blogEntryInput: BlogEntryInput,
        publishAt?: Date,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("公開BlogEntryを作成します。", {
            blogEntryInput: {
                ...blogEntryInput,
                bodyMarkdown: blogEntryInput.bodyMarkdown.length,
            },
            ongoingTransaction: !!ongoingTransaction,
        });

        const { id: createdId } = await this.createDraft(
            blogEntryInput,
            ongoingTransaction,
        );

        return await this.getByBlogEntryId(
            (
                await this.publishBlogEntryDraft(
                    createdId,
                    publishAt,
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async publishBlogEntryDraft(
        blogEntryId: number,
        publishAt?: Date,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("既存の下書きBlogEntryを公開します。", {
            blogEntryId,
            publishAt,
            ongoingTransaction: !!ongoingTransaction,
        });

        const { slug, blogEntryDraft } = await this.getByBlogEntryId(
            blogEntryId,
            ongoingTransaction,
        );
        if (blogEntryDraft === null) {
            throw new ForbiddenException(
                `DraftのないBlogEntryを公開しようとしています。blogEntryId: ${blogEntryId}`,
            );
        }

        const { title, bodyMarkdown } = blogEntryDraft;

        return await this.getByBlogEntryId(
            (
                await this.blogEntryQuery.insertPublishedHistory(
                    blogEntryId,
                    { slug, title, bodyMarkdown },
                    publishAt,
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async addBlogEntryHistory(
        blogEntryId: number,
        blogEntryInput: BlogEntryInput,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("BlogEntryの履歴を追加します。", {
            blogEntryId,
            blogEntryInput: {
                ...blogEntryInput,
                bodyMarkdown: blogEntryInput.bodyMarkdown.length,
            },
            ongoingTransaction: !!ongoingTransaction,
        });

        const { id } = await this.updateDraft(
            blogEntryId,
            blogEntryInput,
            ongoingTransaction,
        );

        return await this.getByBlogEntryId(
            (
                await this.publishBlogEntryDraft(
                    id,
                    undefined,
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async setPublishAt(
        blogEntryId: number,
        publishAt: Date | null,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("BlogEntryの公開日時を設定します。", {
            blogEntryId,
            publishAt,
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.getByBlogEntryId(
            (
                await this.blogEntryQuery.updatePublishAt(
                    blogEntryId,
                    publishAt,
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async seed(
        publishedCount: number,
        historyCount: number,
        draftCount: number,
    ): Promise<[BlogEntryWithRelations[], BlogEntryWithRelations[]]> {
        this.logger.log("BlogEntryのseedを作成します。", {
            publishedCount,
            historyCount,
            draftCount,
        });

        faker.seed(0);
        fakerJA.seed(0);

        const publishes: BlogEntryWithRelations[] = [];
        for (let i = 0; i < publishedCount; i++) {
            publishes.push(
                await this.createPublished({
                    slug: faker.lorem.slug(),
                    bodyMarkdown: fakerJA.lorem.text(),
                    title: fakerJA.book.title(),
                }),
            );
        }
        for (let i = 0; i < historyCount; i++) {
            for (let j = 0; j <= i; j++) {
                const { id, slug } = publishes.at(i)!;
                await this.addBlogEntryHistory(id, {
                    slug,
                    title: fakerJA.book.title(),
                    bodyMarkdown: fakerJA.lorem.text(),
                });
            }
        }

        const drafts: BlogEntryWithRelations[] = [];
        for (let i = 0; i < draftCount; i++) {
            drafts.push(
                await this.createDraft({
                    slug: faker.lorem.slug(),
                    title: fakerJA.book.title(),
                    bodyMarkdown: fakerJA.lorem.text(),
                }),
            );
        }

        return [publishes, drafts];
    }
}
