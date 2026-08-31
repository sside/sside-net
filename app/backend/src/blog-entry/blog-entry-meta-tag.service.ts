import { fakerEN } from "@faker-js/faker";
import { Injectable, Logger } from "@nestjs/common";
import { BlogEntryMetaTag, Prisma } from "../generated/prisma/client";
import {
    BlogEntryMetaTagCountBlogEntry,
    BlogEntryMetaTagQuery,
} from "./query/blog-entry-meta-tag.query";

@Injectable()
export class BlogEntryMetaTagService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly blogEntryMetaTagQuery: BlogEntryMetaTagQuery,
    ) {}

    /**
     * 全てのBlogEntryMetaTagを取得します。
     */
    async getAllBlogEntryMetaTags(
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTag[]> {
        this.logger.log("全てのBlogEntryMetaTagを取得します。", {
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.blogEntryMetaTagQuery.findAll(ongoingTransaction);
    }

    /**
     * 全てのBlogEntryMetaTagと、それらに紐づくBlogEntryの数を取得します。
     */
    async getAndCountAllWithBlogEntryCount(
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTagCountBlogEntry[]> {
        this.logger.log(
            "すべてのBlogEntryMetaTagと、紐づいているBlogEntryの数を取得します。",
        );

        return await this.blogEntryMetaTagQuery.findAllAndCountRelatedBlogEntry(
            ongoingTransaction,
        );
    }

    /**
     * 全ての公開済みBlogEntryに対して、紐づいているBlogEntryMetaTagの数を取得します。
     */
    async getAndCountAllPublishedBlogEntryMetaTags(
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTagCountBlogEntry[]> {
        this.logger.log(
            "全ての公開済みBlogEntryに対して紐づいているBlogEntryMetaTagの数を取得します。",
            {
                ongoingTransaction: !!ongoingTransaction,
            },
        );

        return await this.blogEntryMetaTagQuery.findAllAndCountRelatedPublishedBlogEntry(
            ongoingTransaction,
        );
    }

    /**
     * 渡されたBlogEntryMetaTagIdに対して、紐づいている公開済みBlogEntryの数を取得します。
     */
    async getAndCountPublishedByIds(
        blogEntryMetaTagIds: number[],
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryMetaTagCountBlogEntry[]> {
        this.logger.log(
            "公開済みのBlogEntryに紐づいているBlogEntryMetaTagIdsからMetaTagと紐づきの数を取得します。",
            {
                blogEntryMetaTagIds,
                ongoingTransaction: !!ongoingTransaction,
            },
        );

        return await this.blogEntryMetaTagQuery.findAndCountRelatedPublishedBlogEntryByBlogEntryMetaTagIds(
            blogEntryMetaTagIds,
            ongoingTransaction,
        );
    }

    /**
     * 名前を指定してBlogEntryMetaTagが作成済みなら取得、無ければ新規作成します。
     */
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

    /**
     * 複数の名前に対してBlogEntryMetaTagが作成済みなら取得、無ければ新規作成します。
     */
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

    /**
     * BlogEntryMetaTagのnameを更新します。
     */
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

    /**
     * BlogEntryMetaTagをseedingします。
     */
    async seed(count: number): Promise<BlogEntryMetaTag[]> {
        this.logger.log("BlogEntryMetaTagのseedを作成します。", {
            count,
        });

        return await this.getOrCreateByNames(
            fakerEN.helpers.uniqueArray(() => fakerEN.lorem.slug(1), count),
        );
    }
}
