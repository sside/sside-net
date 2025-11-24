import { faker, fakerJA } from "@faker-js/faker";
import {
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { createIntegerArray } from "@sside-net/utility";
import { Prisma } from "../generated/prisma/client";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import {
    BlogEntryQuery,
    BlogEntryWithRelations,
} from "./query/blog-entry.query";
import { BlogEntryInput } from "./type/BlogEntryInput";

@Injectable()
export class BlogEntryService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly blogEntryMetaTagService: BlogEntryMetaTagService,
        private readonly blogEntryQuery: BlogEntryQuery,
    ) {}

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

    async getByBlogEntryIds(
        blogEntryIds: number[],
        isCheckContainsAllBlogEntry = true,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("複数のIDを指定して対応するBlogEntryを取得します。", {
            blogEntryIds,
            ongoingTransaction: !!ongoingTransaction,
        });

        const blogEntries =
            await this.blogEntryQuery.findManyWithRelationsByBlogEntryIds(
                blogEntryIds,
                ongoingTransaction,
            );

        if (
            isCheckContainsAllBlogEntry &&
            !blogEntryIds.every(
                (blogEntryId) =>
                    blogEntries.findIndex(
                        ({ id: foundId }) => foundId === blogEntryId,
                    ) >= 0,
            )
        ) {
            throw new ForbiddenException(
                `指定されたBlogEntryIdsのうち、見つからなかったBlogEntryがありました。`,
            );
        }

        return blogEntries;
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

    async setRelatedBlogEntryMetaTagsByName(
        blogEntryId: number,
        blogEntryMetaTagNames: string[],
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log(`BlogEntryにBlogEntryMetaTagを紐づけします。`, {
            blogEntryId,
            blogEntryMetaTagNames,
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.getByBlogEntryId(
            (
                await this.blogEntryQuery.updateBlogEntryMetaTags(
                    blogEntryId,
                    (
                        await this.blogEntryMetaTagService.getOrCreateByNames(
                            blogEntryMetaTagNames,
                        )
                    ).map(({ id }) => id),
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async seed(
        publishCount: number,
        historyCount: number,
        draftCount: number,
    ): Promise<[BlogEntryWithRelations[], BlogEntryWithRelations[]]> {
        this.logger.log("BlogEntryのseedを作成します。", {
            publishedCount: publishCount,
            historyCount,
            draftCount,
        });

        const uniqueSlugs = faker.helpers.uniqueArray(
            faker.lorem.slug,
            publishCount + draftCount,
        );

        const createBlogEntryInput = (
            uniqueSlugIndex: number,
            overWrite?: Partial<BlogEntryInput>,
        ): BlogEntryInput => ({
            slug: uniqueSlugs.at(uniqueSlugIndex)!,
            bodyMarkdown: fakerJA.lorem.text(),
            title: fakerJA.book.title(),
            ...overWrite,
        });

        const publishes: BlogEntryWithRelations[] = [];
        for (let i = 0; i < publishCount; i++) {
            const { id, slug } = await this.createPublished(
                createBlogEntryInput(i, {}),
            );

            for (let j = 0; j < historyCount; j++) {
                await this.addBlogEntryHistory(
                    id,
                    createBlogEntryInput(i, { slug }),
                );
            }

            publishes.push(await this.getByBlogEntryId(id));
        }

        const drafts = await Promise.all(
            createIntegerArray(draftCount).map((_, index) =>
                this.createDraft(createBlogEntryInput(publishCount + index)),
            ),
        );

        const blogEntryMetaTags = await this.blogEntryMetaTagService.seed(
            (publishCount + draftCount) * 3,
        );
        let count = 1;
        for (const { id: blogEntryId } of [...publishes, ...drafts]) {
            await this.setRelatedBlogEntryMetaTagsByName(
                blogEntryId,
                [count, count * 2, count * 3].map(
                    (index) => blogEntryMetaTags.at(index - 1)!.name,
                ),
            );
            count += 1;
        }

        return [
            await this.getByBlogEntryIds(publishes.map(({ id }) => id)),
            await this.getByBlogEntryIds(drafts.map(({ id }) => id)),
        ];
    }
}
