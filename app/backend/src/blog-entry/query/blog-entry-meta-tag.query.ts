import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service";
import { BlogEntryMetaTag, Prisma } from "../../generated/prisma/client";

@Injectable()
export class BlogEntryMetaTagQuery {
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

    async findAllRelatedPublishedBlogEntry(
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag[]> {
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
