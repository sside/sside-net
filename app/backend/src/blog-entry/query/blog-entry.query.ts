import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service";
import { BlogEntry, Prisma } from "@prisma/client";
import { BlogEntryRequireData } from "../type/BlogEntryRequireData";

export type BlogEntryWithRelations = NonNullable<
    Awaited<ReturnType<BlogEntryQuery["findFirstWithRelations"]>>
>;

@Injectable()
export class BlogEntryQuery {
    constructor(private readonly databaseService: DatabaseService) {}

    private readonly JOIN_RELATED_TABLES_PRISMA_INCLUDE = {
        blogEntryHistories: true,
        blogEntryDraft: true,
        blogEntryMetaTags: true,
    } satisfies Prisma.BlogEntryInclude;

    async findOneById(
        blogEntryId: string,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations | null> {
        return await this.findFirstWithRelations(
            {
                where: {
                    id: blogEntryId,
                },
            },
            transaction,
        );
    }

    async createOneDraft(
        { slug, title, bodyMarkdown, metaTagIds }: BlogEntryRequireData,
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
                blogEntryMetaTags: {
                    connect: metaTagIds.map((id) => ({
                        id,
                    })),
                },
            },
        });
    }

    async updateOneDraft(
        blogEntryId: string,
        { slug, title, bodyMarkdown, metaTagIds }: BlogEntryRequireData,
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
                blogEntryMetaTags: {
                    set: metaTagIds.map((id) => ({
                        id,
                    })),
                },
            },
        });
    }

    async createOnePublished(
        { slug, title, bodyMarkdown, metaTagIds }: BlogEntryRequireData,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).create({
            data: {
                slug,
                blogEntryHistories: {
                    create: {
                        title,
                        bodyMarkdown,
                    },
                },
                blogEntryMetaTags: {
                    connect: metaTagIds.map((id) => ({
                        id,
                    })),
                },
            },
        });
    }

    async updateOnePublished(
        blogEntryId: string,
        { slug, title, bodyMarkdown, metaTagIds }: BlogEntryRequireData,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).update({
            where: {
                id: blogEntryId,
            },
            data: {
                slug,
                blogEntryDraft: {
                    delete: true,
                },
                blogEntryHistories: {
                    create: {
                        title,
                        bodyMarkdown,
                    },
                },
                blogEntryMetaTags: {
                    set: metaTagIds.map((id) => ({
                        id,
                    })),
                },
            },
        });
    }

    async deleteOneById(
        blogEntryId: string,
        transaction?: Prisma.TransactionClient,
    ): Promise<void> {
        await this.blogEntry(transaction).delete({
            where: {
                id: blogEntryId,
            },
        });

        return;
    }

    private async findFirstWithRelations(
        args: Prisma.BlogEntryFindFirstArgs,
        transaction?: Prisma.TransactionClient,
    ) {
        return await this.blogEntry(transaction).findFirst({
            ...args,
            include: this.JOIN_RELATED_TABLES_PRISMA_INCLUDE,
        });
    }

    private async findUniqueWithRelations(
        args: Prisma.BlogEntryFindUniqueArgs,
        transaction?: Prisma.TransactionClient,
    ) {
        return await this.blogEntry(transaction).findUnique({
            ...args,
            include: this.JOIN_RELATED_TABLES_PRISMA_INCLUDE,
        });
    }

    private async findManyWithRelations(
        args: Prisma.BlogEntryFindManyArgs,
        transaction?: Prisma.TransactionClient,
    ) {
        return await this.blogEntry(transaction).findMany({
            ...args,
            include: this.JOIN_RELATED_TABLES_PRISMA_INCLUDE,
        });
    }

    private blogEntry(transaction?: Prisma.TransactionClient) {
        return (transaction ?? this.databaseService).blogEntry;
    }
}
