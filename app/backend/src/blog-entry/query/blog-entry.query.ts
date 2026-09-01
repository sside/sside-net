import { Injectable } from "@nestjs/common";
import { DeepNonNullable } from "utility-types";
import { DatabaseService } from "../../database/database.service";
import { BlogEntry, Prisma } from "../../generated/prisma/client";
import { BlogEntryInput } from "../type/BlogEntryInput";

export type BlogEntryWithRelations = Prisma.BlogEntryGetPayload<{
    include: (typeof BlogEntryQuery)["INCLUDE_RELATED_TABLES"];
}>;
export type PublishedBlogEntryWithRelations = Omit<
    BlogEntryWithRelations,
    "publishAt"
> &
    DeepNonNullable<Pick<BlogEntryWithRelations, "publishAt">>;

@Injectable()
export class BlogEntryQuery {
    private static readonly INCLUDE_RELATED_TABLES = {
        blogEntryDraft: true,
        blogEntryHistories: true,
        blogEntryMetaTags: true,
    } satisfies Prisma.BlogEntryInclude;

    constructor(private readonly databaseService: DatabaseService) {}

    private static WHERE_PUBLISHED(): Prisma.BlogEntryWhereInput {
        return {
            blogEntryHistories: {
                some: {},
            },
            publishAt: {
                lte: new Date(),
            },
        };
    }

    async findAll(
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations[]> {
        return await this.findManyWithRelation({}, transaction);
    }

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

    async findOnePublishedWithRelationsByBlogEntryId(
        blogEntryId: number,
        transaction?: Prisma.TransactionClient,
    ): Promise<PublishedBlogEntryWithRelations | null> {
        return (await this.findFirstWithRelation(
            {
                where: {
                    ...BlogEntryQuery.WHERE_PUBLISHED(),
                    id: blogEntryId,
                },
            },
            transaction,
        )) as PublishedBlogEntryWithRelations;
    }

    async findOnePublishedWithRelationsBySlug(
        slug: string,
        transaction?: Prisma.TransactionClient,
    ): Promise<PublishedBlogEntryWithRelations | null> {
        return (await this.findFirstWithRelation(
            {
                where: {
                    ...BlogEntryQuery.WHERE_PUBLISHED(),
                    slug,
                },
            },
            transaction,
        )) as PublishedBlogEntryWithRelations;
    }

    async findManyWithRelationsByBlogEntryIds(
        blogEntryIds: number[],
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations[]> {
        return await this.findManyWithRelation(
            {
                where: {
                    id: {
                        in: blogEntryIds,
                    },
                },
            },
            transaction,
        );
    }

    async findManyLatestPublishedWithRelations(
        count: number,
        pointerPublishAtLte?: Date,
    ): Promise<PublishedBlogEntryWithRelations[]> {
        return (await this.findManyWithRelation({
            where: {
                ...BlogEntryQuery.WHERE_PUBLISHED(),
                publishAt: {
                    lte: pointerPublishAtLte,
                },
            },
            orderBy: {
                publishAt: "desc",
            },
            take: count,
        })) as PublishedBlogEntryWithRelations[];
    }

    async findManyPublishedByRange(
        searchStartAtGte: Date,
        searchEndAtLt: Date,
        count: number,
        pointerPublishAtLte?: Date,
    ): Promise<PublishedBlogEntryWithRelations[]> {
        return (await this.findManyWithRelation({
            where: {
                AND: [
                    BlogEntryQuery.WHERE_PUBLISHED(),
                    {
                        publishAt: {
                            lte: pointerPublishAtLte,
                        },
                    },
                    {
                        publishAt: {
                            gte: searchStartAtGte,
                        },
                    },
                    {
                        publishAt: {
                            lte: searchEndAtLt,
                        },
                    },
                ],
            },
            take: count,
        })) as PublishedBlogEntryWithRelations[];
    }

    async findManyAdjacentPublishedByPublishAt(
        publishAt: Date,
        count: number,
        order: Prisma.SortOrder,
    ): Promise<PublishedBlogEntryWithRelations[]> {
        return (await this.findManyWithRelation({
            where: {
                AND: [
                    BlogEntryQuery.WHERE_PUBLISHED(),
                    {
                        publishAt:
                            order === "asc" ?
                                {
                                    gt: publishAt,
                                }
                            :   {
                                    lt: publishAt,
                                },
                    },
                ],
            },
            orderBy: {
                publishAt: order,
            },
            take: count,
        })) as PublishedBlogEntryWithRelations[];
    }

    async findManyPublishedLaterByPublishAt(
        publishAtGt: Date,
        count: number,
    ): Promise<PublishedBlogEntryWithRelations[]> {
        return (await this.findManyWithRelation({
            where: {
                AND: [
                    BlogEntryQuery.WHERE_PUBLISHED(),
                    {
                        publishAt: {
                            gt: publishAtGt,
                        },
                    },
                ],
            },
            orderBy: {
                publishAt: "asc",
            },
            take: count,
        })) as PublishedBlogEntryWithRelations[];
    }

    async findManyPublishedEarlierByPublishAt(
        publishAtLt: Date,
        count: number,
    ): Promise<PublishedBlogEntryWithRelations[]> {
        return (await this.findManyWithRelation({
            where: {
                AND: [
                    BlogEntryQuery.WHERE_PUBLISHED(),
                    {
                        publishAt: {
                            lt: publishAtLt,
                        },
                    },
                ],
            },
            orderBy: {
                publishAt: "desc",
            },
            take: count,
        })) as PublishedBlogEntryWithRelations[];
    }

    async findManyPublishAt(): Promise<Date[]> {
        return (
            await this.blogEntry().findMany({
                where: BlogEntryQuery.WHERE_PUBLISHED(),
                select: {
                    publishAt: true,
                },
            })
        ).map(({ publishAt }) => publishAt!);
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

    async updateBlogEntryMetaTags(
        blogEntryId: number,
        blogEntryMetaTagIds: number[],
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntry> {
        return await this.blogEntry(transaction).update({
            where: {
                id: blogEntryId,
            },
            data: {
                blogEntryMetaTags: {
                    set: blogEntryMetaTagIds.map((id) => ({
                        id,
                    })),
                },
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
            include: BlogEntryQuery.INCLUDE_RELATED_TABLES,
        });
    }

    private async findFirstWithRelation(
        args: Prisma.BlogEntryFindFirstArgs,
        transaction?: Prisma.TransactionClient,
    ) {
        return await this.blogEntry(transaction).findFirst({
            ...args,
            include: BlogEntryQuery.INCLUDE_RELATED_TABLES,
        });
    }

    private async findManyWithRelation(
        args: Prisma.BlogEntryFindManyArgs,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations[]> {
        return await this.blogEntry(transaction).findMany({
            ...args,
            include: BlogEntryQuery.INCLUDE_RELATED_TABLES,
        });
    }

    private blogEntry(transaction?: Prisma.TransactionClient) {
        return (transaction ?? this.databaseService).blogEntry;
    }
}
