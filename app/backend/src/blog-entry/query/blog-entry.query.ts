import { Injectable } from "@nestjs/common";
import { BlogEntry, Prisma } from "@prisma/client";
import { DatabaseService } from "../../database/database.service";
import { BlogEntryInput } from "../type/BlogEntryInput";

export type BlogEntryWithRelations = NonNullable<
    Awaited<ReturnType<BlogEntryQuery["findFirstWithRelation"]>>
>;

@Injectable()
export class BlogEntryQuery {
    private readonly RELATED_TABLES_PRISMA_JOIN = {
        blogEntryDraft: true,
        blogEntryHistories: true,
        blogEntryMetaTags: true,
    } satisfies Prisma.BlogEntryInclude;

    constructor(private readonly databaseService: DatabaseService) {}

    async findOneWithRelationsByBlogEntryId(
        blogEntryId: number,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations | null> {
        return await this.findUniqueWithRelation(
            {
                where: {
                    id: blogEntryId,
                },
            },
            transaction,
        );
    }

    async insertDraft(
        { slug, title, bodyMarkdown }: BlogEntryInput,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).create({
            data: {
                slug,
                blogEntryDraft: {
                    create: {
                        title,
                        bodyMarkdown,
                    },
                },
            },
        });
    }

    async updateDraft(
        blogEntryId: number,
        { slug, title, bodyMarkdown }: BlogEntryInput,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).update({
            where: {
                id: blogEntryId,
            },
            data: {
                slug,
                blogEntryDraft: {
                    upsert: {
                        update: {
                            title,
                            bodyMarkdown,
                        },
                        create: {
                            title,
                            bodyMarkdown,
                        },
                    },
                },
            },
        });
    }

    async updatePublishAt(
        blogEntryId: number,
        publishAt: Date | null,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).update({
            where: {
                id: blogEntryId,
            },
            data: {
                publishAt,
            },
        });
    }

    async insertPublishedHistory(
        blogEntryId: number,
        { slug, title, bodyMarkdown }: BlogEntryInput,
        publishAt?: Date,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).update({
            where: {
                id: blogEntryId,
            },
            data: {
                slug,
                publishAt,
                blogEntryHistories: {
                    create: {
                        title,
                        bodyMarkdown,
                    },
                },
                blogEntryDraft: {
                    delete: true,
                },
            },
        });
    }

    private async findUniqueWithRelation(
        args: Prisma.BlogEntryFindUniqueArgs,
        transaction?: Prisma.TransactionClient,
    ) {
        return await this.blogEntry(transaction).findUnique({
            ...args,
            include: this.RELATED_TABLES_PRISMA_JOIN,
        });
    }
    private async findFirstWithRelation(
        args: Prisma.BlogEntryFindFirstArgs,
        transaction?: Prisma.TransactionClient,
    ) {
        return await this.blogEntry(transaction).findFirst({
            ...args,
            include: this.RELATED_TABLES_PRISMA_JOIN,
        });
    }

    private blogEntry(transaction?: Prisma.TransactionClient) {
        return (transaction ?? this.databaseService).blogEntry;
    }
}
