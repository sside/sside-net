import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service";
import { BlogEntryMetaTag, Prisma } from "../../generated/prisma/client";

export type BlogEntryMetaTagCountBlogEntry = Prisma.BlogEntryMetaTagGetPayload<{
    include: (typeof BlogEntryMetaTagQuery)["INCLUDE_COUNT_BLOG_ENTRY"];
}>;

@Injectable()
export class BlogEntryMetaTagQuery {
    private static readonly INCLUDE_COUNT_BLOG_ENTRY = {
        _count: {
            select: {
                blogEntries: true,
            },
        },
    } satisfies Prisma.BlogEntryMetaTagInclude;

    constructor(private readonly databaseService: DatabaseService) {}

    async findOneByName(
        metaTagName: string,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag | null> {
        return await this.blogEntryMetaTag(transaction).findUnique({
            where: {
                name: metaTagName,
            },
        });
    }

    async findAll(
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag[]> {
        return await this.blogEntryMetaTag(transaction).findMany();
    }

    async findAllAndCountRelatedPublishedBlogEntry(
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTagCountBlogEntry[]> {
        return await this.blogEntryMetaTag(transaction).findMany({
            where: {
                blogEntries: {
                    some: {
                        blogEntryHistories: {
                            some: {},
                        },
                    },
                },
            },
            include: BlogEntryMetaTagQuery.INCLUDE_COUNT_BLOG_ENTRY,
        });
    }

    async insertOne(
        metaTagName: string,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag> {
        return await this.blogEntryMetaTag(transaction).create({
            data: {
                name: metaTagName,
            },
        });
    }

    async updateNameByBlogEntryMetaTagId(
        blogEntryMetaTagId: number,
        metaTagName: string,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag> {
        return await this.blogEntryMetaTag(transaction).update({
            where: {
                id: blogEntryMetaTagId,
            },
            data: {
                name: metaTagName,
            },
        });
    }

    private blogEntryMetaTag(transaction?: Prisma.TransactionClient) {
        return (transaction ?? this.databaseService).blogEntryMetaTag;
    }
}
