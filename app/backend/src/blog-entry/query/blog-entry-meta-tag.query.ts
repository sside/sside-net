import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service";
import { BlogEntryMetaTag, Prisma } from "../../generated/prisma/client";

export type BlogEntryMetaTagCountBlogEntry = Prisma.BlogEntryMetaTagGetPayload<{
    include: (typeof BlogEntryMetaTagQuery)["INCLUDE_COUNT_BLOG_ENTRY"];
}>;

@Injectable()
export class BlogEntryMetaTagQuery {
    private static readonly WHERE_RELATE_PUBLISHED_BLOG_ENTRY = {
        some: {
            AND: [
                {
                    publishAt: {
                        not: null,
                    },
                },
                {
                    blogEntryHistories: {
                        some: {},
                    },
                },
            ],
        },
    } satisfies Prisma.BlogEntryMetaTagWhereInput["blogEntries"];

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

    async findAllAndCountRelatedBlogEntry(
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTagCountBlogEntry[]> {
        return await this.blogEntryMetaTag(transaction).findMany({
            where: {
                blogEntries:
                    BlogEntryMetaTagQuery.WHERE_RELATE_PUBLISHED_BLOG_ENTRY,
            },
            include: BlogEntryMetaTagQuery.INCLUDE_COUNT_BLOG_ENTRY,
        });
    }

    async findAllAndCountRelatedPublishedBlogEntry(
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTagCountBlogEntry[]> {
        return await this.blogEntryMetaTag(transaction).findMany({
            where: {
                blogEntries:
                    BlogEntryMetaTagQuery.WHERE_RELATE_PUBLISHED_BLOG_ENTRY,
            },
            include: BlogEntryMetaTagQuery.INCLUDE_COUNT_BLOG_ENTRY,
        });
    }

    async findAndCountRelatedPublishedBlogEntryByBlogEntryMetaTagIds(
        blogEntryMetaTagIds: number[],
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTagCountBlogEntry[]> {
        return await this.blogEntryMetaTag(transaction).findMany({
            where: {
                id: {
                    in: blogEntryMetaTagIds,
                },
                blogEntries:
                    BlogEntryMetaTagQuery.WHERE_RELATE_PUBLISHED_BLOG_ENTRY,
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
