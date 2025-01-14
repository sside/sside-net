import { Injectable } from "@nestjs/common";
import { BlogEntry, Prisma } from "@prisma/client";
import { DatabaseService } from "../../database/database.service";

export type BlogEntryWithRelations = NonNullable<
    Awaited<ReturnType<BlogEntryQuery["findFirstWithRelations"]>>
>;

@Injectable()
export class BlogEntryQuery {
    private readonly PRISMA_INCLUDE_RELATED_TABLES = {
        blogEntryDraft: true,
        blogEntryHistories: true,
        blogEntryMetaTags: true,
    } satisfies Prisma.BlogEntryInclude;

    private readonly PRISMA_WHERE_PUBLISHED_ENTRY = {
        blogEntryHistories: {
            some: {},
        },
    } satisfies Prisma.BlogEntryWhereInput;

    constructor(private readonly databaseService: DatabaseService) {}

    async findUniqueByIdWithRelations(
        blogEntryId: number,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations | null> {
        return await this.findUniqueWithRelations(
            {
                where: {
                    id: blogEntryId,
                },
            },
            transaction,
        );
    }

    async insert(
        blogEntry: Prisma.BlogEntryCreateInput,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).create({
            data: blogEntry,
        });
    }

    async update(
        blogEntryId: number,
        blogEntry: Prisma.BlogEntryUpdateInput,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).update({
            where: {
                id: blogEntryId,
            },
            data: blogEntry,
        });
    }

    async upsertDraft(
        blogEntryId: number,
        blogEntry: Prisma.BlogEntryUpdateInput,
        blogEntryDraft: Omit<Prisma.BlogEntryDraftCreateInput, "blogEntry">,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).update({
            where: {
                id: blogEntryId,
            },
            data: {
                ...blogEntry,
                blogEntryDraft: {
                    upsert: {
                        create: blogEntryDraft,
                        update: blogEntryDraft,
                    },
                },
            },
        });
    }

    async deleteDraft(
        blogEntryId: number,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).update({
            where: {
                id: blogEntryId,
            },
            data: {
                blogEntryDraft: {
                    delete: true,
                },
            },
        });
    }

    private async findFirstWithRelations(
        findFirstArgs: Prisma.BlogEntryFindFirstArgs,
        transaction?: Prisma.TransactionClient,
    ) {
        return await this.blogEntry(transaction).findFirst({
            ...findFirstArgs,
            include: this.PRISMA_INCLUDE_RELATED_TABLES,
        });
    }

    private async findUniqueWithRelations(
        findUniqueArgs: Prisma.BlogEntryFindUniqueArgs,
        transaction?: Prisma.TransactionClient,
    ) {
        return await this.blogEntry(transaction).findUnique({
            ...findUniqueArgs,
            include: this.PRISMA_INCLUDE_RELATED_TABLES,
        });
    }

    private async findManyWithRelations(
        findManyArgs: Prisma.BlogEntryFindManyArgs,
        transaction?: Prisma.TransactionClient,
    ) {
        return await this.blogEntry(transaction).findMany({
            ...findManyArgs,
            include: this.PRISMA_INCLUDE_RELATED_TABLES,
        });
    }

    private blogEntry(transaction?: Prisma.TransactionClient) {
        return (transaction ?? this.databaseService).blogEntry;
    }
}
