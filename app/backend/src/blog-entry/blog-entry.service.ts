import { fakerEN, fakerJA } from "@faker-js/faker";
import {
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import {
    MARKDOWN_SAMPLE_ALLYSONSILVA,
    MARKDOWN_SAMPLE_GITHUB_FLAVORED_GIELLALT,
    MARKDOWN_SAMPLE_OLD_BLOG_1,
    MARKDOWN_SAMPLE_OLD_BLOG_2,
} from "@sside-net/constant";
import { createIntegerArray } from "@sside-net/utility";
import { Prisma } from "../generated/prisma/client";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import {
    BlogEntryQuery,
    BlogEntryWithRelations,
} from "./query/blog-entry.query";
import { BlogEntryInput } from "./type/BlogEntryInput";

@Injectable()
export class BlogEntryService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly blogEntryMetaTagService: BlogEntryMetaTagService,
        private readonly blogEntryQuery: BlogEntryQuery,
    ) {}

    /**
     * すべてのBlogEntryを取得します。
     */
    async getAll(
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("BlogEntryを全件取得します。");

        return await this.blogEntryQuery.findAll(ongoingTransaction);
    }

    /**
     * IDを指定してBlogEntryを取得します。
     */
    async getByBlogEntryId(
        blogEntryId: number,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("idからBlogEntryを取得します。", {
            blogEntryId,
            ongoingTransaction: !!ongoingTransaction,
        });

        const blogEntry =
            await this.blogEntryQuery.findOneWithRelationsByBlogEntryId(
                blogEntryId,
                ongoingTransaction,
            );

        if (blogEntry === null) {
            throw new NotFoundException(
                `BlogEntryが見つかりませんでした。blogEntryId: ${blogEntryId}`,
            );
        }

        return blogEntry;
    }

    /**
     * 複数のIDを指定してBlogEntryを取得します。
     */
    async getByBlogEntryIds(
        blogEntryIds: number[],
        isCheckContainsAllBlogEntry = true,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("複数のIDを指定して対応するBlogEntryを取得します。", {
            blogEntryIds,
            ongoingTransaction: !!ongoingTransaction,
        });

        const blogEntries =
            await this.blogEntryQuery.findManyWithRelationsByBlogEntryIds(
                blogEntryIds,
                ongoingTransaction,
            );

        if (
            isCheckContainsAllBlogEntry &&
            !blogEntryIds.every((blogEntryId) =>
                blogEntries.some(({ id: foundId }) => foundId === blogEntryId),
            )
        ) {
            throw new ForbiddenException(
                `指定されたBlogEntryIdsのうち、見つからなかったBlogEntryがありました。`,
            );
        }

        return blogEntries;
    }

    /**
     * slugで公開されたBlogEntryを取得します。
     */
    async getPublishedBySlug(slug: string): Promise<BlogEntryWithRelations> {
        this.logger.log("slugでBlogEntryを取得します。", {
            slug,
        });

        const found =
            await this.blogEntryQuery.findOnePublishedWithRelationsBySlug(slug);

        if (!found) {
            throw new NotFoundException(
                `BlogEntryが見つかりませんでした。slug:${slug}`,
            );
        }

        return found;
    }

    /**
     * 直近に公開されたBlogEntryを取得します。
     * ページングのため、ポインターになるBlogEntryがある場合はTupleの2つ目に入ります。
     */
    async getLatestPublishedBlogEntries(
        count: number,
        pointerBlogEntryId?: number,
    ): Promise<[BlogEntryWithRelations[], BlogEntryWithRelations | null]> {
        this.logger.log("直近に公開されたBlogEntryを取得します。", {
            count,
            pointerBlogEntryId,
        });

        const pointerPublishAt: Date | undefined = await (async () => {
            if (!pointerBlogEntryId) {
                return;
            }

            try {
                return (
                    (await this.getByBlogEntryId(pointerBlogEntryId))
                        .publishAt ?? undefined
                );
            } catch {
                return;
            }
        })();

        const searchCount = count + 1;
        const blogEntries =
            await this.blogEntryQuery.findManyLatestPublishedWithRelations(
                count + 1,
                pointerPublishAt,
            );

        if (blogEntries.length < searchCount) {
            return [blogEntries, null];
        }

        return [blogEntries.slice(0, count), blogEntries.at(-1)!];
    }

    async getAllBlogEntriesPublishAt(): Promise<Date[]> {
        this.logger.log("全ての公開済みBlogEntryの公開日を取得します。");

        return await this.blogEntryQuery.findManyPublishAt();
    }

    async createDraft(
        blogEntryInput: BlogEntryInput,
        blogEntryMetaTagNames: string[],
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("BlogEntryの下書きを作成します。", {
            blogEntryInput: {
                ...blogEntryInput,
                bodyMarkdown: blogEntryInput.bodyMarkdown.length,
            },
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.setRelatedBlogEntryMetaTagsByName(
            (
                await this.blogEntryQuery.insertDraft(
                    blogEntryInput,
                    ongoingTransaction,
                )
            ).id,
            blogEntryMetaTagNames,
            ongoingTransaction,
        );
    }

    async updateDraft(
        blogEntryId: number,
        blogEntryInput: BlogEntryInput,
        blogEntryMetaTagNames: string[],
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("BlogEntryの下書きを更新します。", {
            blogEntryId,
            blogEntryInput: {
                ...blogEntryInput,
                bodyMarkdown: blogEntryInput.bodyMarkdown.length,
            },
            ongoingTransaction: !!ongoingTransaction,
        });

        // 存在チェック
        await this.getByBlogEntryId(blogEntryId, ongoingTransaction);

        return await this.setRelatedBlogEntryMetaTagsByName(
            (
                await this.blogEntryQuery.updateDraft(
                    blogEntryId,
                    blogEntryInput,
                    ongoingTransaction,
                )
            ).id,
            blogEntryMetaTagNames,
            ongoingTransaction,
        );
    }

    async createPublished(
        blogEntryInput: BlogEntryInput,
        blogEntryMetaTagNames: string[],
        publishAt?: Date,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("公開BlogEntryを作成します。", {
            blogEntryInput: {
                ...blogEntryInput,
                bodyMarkdown: blogEntryInput.bodyMarkdown.length,
            },
            ongoingTransaction: !!ongoingTransaction,
        });

        const { id: createdId } = await this.createDraft(
            blogEntryInput,
            blogEntryMetaTagNames,
            ongoingTransaction,
        );

        return await this.getByBlogEntryId(
            (
                await this.publishBlogEntryDraft(
                    createdId,
                    publishAt,
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async publishBlogEntryDraft(
        blogEntryId: number,
        publishAt?: Date,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("既存の下書きBlogEntryを公開します。", {
            blogEntryId,
            publishAt,
            ongoingTransaction: !!ongoingTransaction,
        });

        const {
            slug,
            blogEntryDraft,
            publishAt: existsPublishAt,
        } = await this.getByBlogEntryId(blogEntryId, ongoingTransaction);
        if (blogEntryDraft === null) {
            throw new ForbiddenException(
                `DraftのないBlogEntryを公開しようとしています。blogEntryId: ${blogEntryId}`,
            );
        }

        const { title, bodyMarkdown } = blogEntryDraft;

        return await this.getByBlogEntryId(
            (
                await this.blogEntryQuery.insertPublishedHistory(
                    blogEntryId,
                    { slug, title, bodyMarkdown },
                    existsPublishAt ?? publishAt ?? new Date(),
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async addBlogEntryHistory(
        blogEntryId: number,
        blogEntryInput: BlogEntryInput,
        blogEntryMetaTagNames: string[],
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("BlogEntryの履歴を追加します。", {
            blogEntryId,
            blogEntryInput: {
                ...blogEntryInput,
                bodyMarkdown: blogEntryInput.bodyMarkdown.length,
            },
            ongoingTransaction: !!ongoingTransaction,
        });

        const { id } = await this.updateDraft(
            blogEntryId,
            blogEntryInput,
            blogEntryMetaTagNames,
            ongoingTransaction,
        );

        return await this.getByBlogEntryId(
            (
                await this.publishBlogEntryDraft(
                    id,
                    undefined,
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async setPublishAt(
        blogEntryId: number,
        publishAt: Date | null,
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log("BlogEntryの公開日時を設定します。", {
            blogEntryId,
            publishAt,
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.getByBlogEntryId(
            (
                await this.blogEntryQuery.updatePublishAt(
                    blogEntryId,
                    publishAt,
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async setRelatedBlogEntryMetaTagsByName(
        blogEntryId: number,
        blogEntryMetaTagNames: string[],
        ongoingTransaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryWithRelations> {
        this.logger.log(`BlogEntryにBlogEntryMetaTagを紐づけします。`, {
            blogEntryId,
            blogEntryMetaTagNames,
            ongoingTransaction: !!ongoingTransaction,
        });

        return await this.getByBlogEntryId(
            (
                await this.blogEntryQuery.updateBlogEntryMetaTags(
                    blogEntryId,
                    (
                        await this.blogEntryMetaTagService.getOrCreateByNames(
                            blogEntryMetaTagNames,
                        )
                    ).map(({ id }) => id),
                    ongoingTransaction,
                )
            ).id,
        );
    }

    async seed(
        publishCount: number,
        maximumHistoryCount: number,
        draftCount: number,
    ): Promise<[BlogEntryWithRelations[], BlogEntryWithRelations[]]> {
        this.logger.log("BlogEntryのseedを作成します。", {
            publishedCount: publishCount,
            maximumHistoryCount,
            draftCount,
        });

        const uniqueSlugs = fakerEN.helpers.uniqueArray(
            fakerEN.lorem.slug,
            publishCount + draftCount,
        );

        const blogEntryBodySamples = [
            MARKDOWN_SAMPLE_GITHUB_FLAVORED_GIELLALT,
            MARKDOWN_SAMPLE_ALLYSONSILVA,
            MARKDOWN_SAMPLE_OLD_BLOG_1,
            MARKDOWN_SAMPLE_OLD_BLOG_2,
        ];
        const createBlogEntryInput = (
            uniqueSlugIndex: number,
            overWrite?: Partial<BlogEntryInput>,
        ): BlogEntryInput => ({
            slug: uniqueSlugs.at(uniqueSlugIndex)!,
            bodyMarkdown: blogEntryBodySamples.at(
                uniqueSlugIndex % blogEntryBodySamples.length,
            )!,
            title: fakerJA.book.title(),
            ...overWrite,
        });

        const blogEntryMetaTags = await this.blogEntryMetaTagService.seed(
            (publishCount + draftCount) * 3,
        );

        const publishes: BlogEntryWithRelations[] = [];
        for (let index = 0; index < publishCount; index++) {
            const { id, slug } = await this.createPublished(
                createBlogEntryInput(index, {}),
                fakerEN.helpers
                    .arrayElements(blogEntryMetaTags)
                    .map(({ name }) => name),
                fakerJA.date.past({
                    years: 5,
                }),
            );

            const historyCount = fakerJA.number.int({
                min: 1,
                max: maximumHistoryCount,
            });
            for (let index_ = 0; index_ < historyCount; index_++) {
                await this.addBlogEntryHistory(
                    id,
                    createBlogEntryInput(index, { slug }),
                    fakerEN.helpers
                        .arrayElements(blogEntryMetaTags)
                        .map(({ name }) => name),
                );
            }

            publishes.push(await this.getByBlogEntryId(id));
        }

        const drafts = await Promise.all(
            createIntegerArray(draftCount).map((_, index) =>
                this.createDraft(
                    createBlogEntryInput(publishCount + index),
                    fakerEN.helpers
                        .arrayElements(blogEntryMetaTags)
                        .map(({ name }) => name),
                ),
            ),
        );

        return [
            await this.getByBlogEntryIds(publishes.map(({ id }) => id)),
            await this.getByBlogEntryIds(drafts.map(({ id }) => id)),
        ];
    }
}
