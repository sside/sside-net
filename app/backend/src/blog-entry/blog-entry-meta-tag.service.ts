import { faker } from "@faker-js/faker";
import { Injectable, Logger } from "@nestjs/common";
import { BlogEntryMetaTag, Prisma } from "@prisma/client";
import { createIntegerRange } from "@sside-net/utility";
import { BlogEntryMetaTagQuery } from "./query/blog-entry-meta-tag.query";

@Injectable()
export class BlogEntryMetaTagService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly blogEntryMetaTagQuery: BlogEntryMetaTagQuery,
    ) {}

    async getAllBlogEntryMetaTags(
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag[]> {
        this.logger.log("全てのBlogEntryMetaTagを取得します。", {
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.blogEntryMetaTagQuery.findAll(ongoingTransaction);
    }

    async getOrCreateByName(
        metaTagName: string,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag> {
        this.logger.log("BlogEntryMetaTagを取得、または新規作成します。", {
            metaTagName,
            ongoingTransaction: !!ongoingTransaction,
        });

        const found = await this.blogEntryMetaTagQuery.findOneByName(
            metaTagName,
            ongoingTransaction,
        );
        if (found) {
            return found;
        }

        this.logger.log("BlogEntryMetaTagを作成します。", {
            metaTagName,
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.blogEntryMetaTagQuery.insertOne(
            metaTagName.trim(),
            ongoingTransaction,
        );
    }

    async getOrCreateByNames(
        metaTagNames: string[],
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag[]> {
        this.logger.log(
            "複数のmetaTagNameに対してBlogEntryMetaTagを取得、または新規作成します。",
            {
                metaTagNames,
                ongoingTransaction: !!ongoingTransaction,
            },
        );

        return await Promise.all(
            metaTagNames.map(
                async (metaTagName) =>
                    await this.getOrCreateByName(
                        metaTagName,
                        ongoingTransaction,
                    ),
            ),
        );
    }

    async updateName(
        blogEntryMetaTagId: number,
        metaTagName: string,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag> {
        this.logger.log("BlogEntryMetaTagのnameを更新します。", {
            blogEntryMetaTagId,
            metaTagName,
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.blogEntryMetaTagQuery.updateNameByBlogEntryMetaTagId(
            blogEntryMetaTagId,
            metaTagName,
            ongoingTransaction,
        );
    }

    async seed(count: number): Promise<BlogEntryMetaTag[]> {
        this.logger.log("BlogEntryMetaTagのseedを作成します。", {
            count,
        });

        faker.seed(0);

        return await this.getOrCreateByNames(
            createIntegerRange(1, count).map(() => faker.lorem.slug(1)),
        );
    }
}
