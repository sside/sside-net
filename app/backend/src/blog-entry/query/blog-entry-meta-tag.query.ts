import { Injectable } from "@nestjs/common";
import { BlogEntryMetaTag, Prisma } from "@prisma/client";
import { DatabaseService } from "../../database/database.service";

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
