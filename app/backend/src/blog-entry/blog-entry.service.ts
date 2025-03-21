import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { BlogEntry, Prisma } from "@prisma/client";
import { faker, fakerJA } from "@faker-js/faker";
import { DatabaseService } from "../database/database.service";
import { LoggerService } from "../logger/logger.service";
import { Seedable } from "../type/service/Seedable";
import { createErrorMessage } from "../utility/error-message/createErrorMessage";
import {
    BlogEntryQuery,
    BlogEntryWithRelations,
} from "./query/blog-entry.query";

@Injectable()
export class BlogEntryService implements Seedable {
    constructor(
        private readonly loggerService: LoggerService,
        private readonly databaseService: DatabaseService,
        private readonly blogEntryQuery: BlogEntryQuery,
    ) {
        this.loggerService.setContext(this.constructor.name);
    }

    async getById(
        blogEntryId: number,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.loggerService.log("IDでBlogEntryを取得します。", {
            blogEntryId,
            ongoingTransaction: !!ongoingTransaction,
        });

        const blogEntry = await this.blogEntryQuery.findUniqueByIdWithRelations(
            blogEntryId,
            ongoingTransaction,
        );

        if (!blogEntry) {
            throw new NotFoundException(
                createErrorMessage("BlogEntryが見つかりませんでした。", {
                    blogEntryId,
                }),
            );
        }

        return blogEntry;
    }

    async createDraft(
        slug: string,
        title: string,
        bodyMarkdown: string,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        this.loggerService.log("BlogEntryの下書きを新規作成します。", {
            slug,
            title,
            ongoingTransaction: !!ongoingTransaction,
        });

        const { id } = await this.blogEntryQuery.insert(
            {
                slug,
                blogEntryDraft: {
                    create: {
                        title,
                        bodyMarkdown,
                    },
                },
            },
            ongoingTransaction,
        );

        return this.getById(id);
    }

    async upsertDraft(
        blogEntryId: number,
        slug: string,
        title: string,
        bodyMarkdown: string,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.loggerService.log("BlogEntryDraftを更新、または作成します。", {
            blogEntryId,
            slug,
            title,
            ongoingTransaction: !!ongoingTransaction,
        });

        await this.blogEntryQuery.upsertDraft(
            blogEntryId,
            { slug },
            { title, bodyMarkdown },
            ongoingTransaction,
        );

        return this.getById(blogEntryId);
    }

    async createPublished(
        slug: string,
        title: string,
        bodyMarkdown: string,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        this.loggerService.log("公開BlogEntryを新規に作成します。", {
            slug,
            title,
            ongoingTransaction: !!ongoingTransaction,
        });

        const { id } = await this.createDraft(
            slug,
            title,
            bodyMarkdown,
            ongoingTransaction,
        );

        return await this.publishExistDraft(id, ongoingTransaction);
    }

    async unpublish(blogEntryId: number): Promise<BlogEntryWithRelations> {
        this.loggerService.log("BlogEntryの公開を取り下げます。", {
            blogEntryId,
        });

        await this.blogEntryQuery.update(blogEntryId, {
            publishAt: null,
        });

        return await this.getById(blogEntryId);
    }

    async publishExistDraft(
        blogEntryId: number,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.loggerService.log("BlogEntryの下書きを公開します。", {
            blogEntryId,
            ongoingTransaction: !!ongoingTransaction,
        });

        await this.databaseService.transaction(async (transaction) => {
            const {
                blogEntryDraft,
                publishAt: existsPublishAt,
                blogEntryHistories,
            } = await this.getById(blogEntryId, transaction);
            if (!blogEntryDraft) {
                throw new ConflictException(
                    createErrorMessage(
                        "BlogEntryDraftが空のため公開が出来ません。",
                        { blogEntryId },
                    ),
                );
            }

            const { title, bodyMarkdown } = blogEntryDraft;
            const latestHistory = blogEntryHistories?.at(-1);
            const publishAt = existsPublishAt ?? new Date();

            if (
                latestHistory?.title !== title ||
                latestHistory?.bodyMarkdown !== bodyMarkdown
            ) {
                await this.blogEntryQuery.update(
                    blogEntryId,
                    {
                        publishAt,
                        blogEntryHistories: {
                            create: {
                                title,
                                bodyMarkdown,
                                createdAt: publishAt,
                            },
                        },
                    },
                    transaction,
                );
            } else {
                await this.blogEntryQuery.update(blogEntryId, {
                    publishAt,
                });
            }

            await this.blogEntryQuery.deleteDraft(blogEntryId, transaction);
        }, ongoingTransaction);

        return await this.getById(blogEntryId);
    }

    async seed(
        publishedCount = 0,
        draftCount = 0,
    ): Promise<[BlogEntry[], BlogEntry[]]> {
        this.loggerService.log("BlogEntryのseedを作成します。", {
            draftCount,
            publishedCount,
        });

        faker.seed(0);
        fakerJA.seed(0);

        const publishedBlogEntries: BlogEntry[] = [];
        for (let i = 0; i < publishedCount; i++) {
            const slug = faker.lorem.slug(6);
            const title = fakerJA.book.title();
            const bodyMarkdown = fakerJA.lorem.text();
            this.loggerService.log("公開BlogEntryシードデータ", {
                slug,
                title,
                bodyMarkdown,
                count: i,
            });

            publishedBlogEntries.push(
                await this.createPublished(slug, title, bodyMarkdown),
            );
        }

        const draftBlogEntries: BlogEntry[] = [];
        for (let i = 0; i < draftCount; i++) {
            const slug = faker.lorem.slug(6);
            const title = fakerJA.book.title();
            const bodyMarkdown = fakerJA.lorem.text();
            this.loggerService.log("下書きBlogEntryシードデータ", {
                slug,
                title,
                bodyMarkdown,
                count: i,
            });

            draftBlogEntries.push(
                await this.createDraft(
                    faker.lorem.slug(6),
                    fakerJA.book.title(),
                    fakerJA.lorem.text(),
                ),
            );
        }

        return [publishedBlogEntries, draftBlogEntries];
    }
}
