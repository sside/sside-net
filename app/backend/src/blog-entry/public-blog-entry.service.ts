import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { createJstMonthRange, createJstYearRange } from "@sside-net/date-time";
import { BlogEntryService } from "./blog-entry.service";
import {
    BlogEntryQuery,
    BlogEntryWithRelations,
} from "./query/blog-entry.query";

@Injectable()
export class PublicBlogEntryService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly blogEntryService: BlogEntryService,
        private readonly blogEntryQuery: BlogEntryQuery,
    ) {}

    /**
     * idで公開されたBlogEntryを取得します。
     */
    async getById(blogEntryId: number): Promise<BlogEntryWithRelations> {
        this.logger.log("idで公開済みBlogEntryを取得します。", {
            blogEntryId,
        });

        const foundBlogEntry =
            await this.blogEntryService.getByBlogEntryId(blogEntryId);

        const { publishAt } = foundBlogEntry;
        if (!publishAt || publishAt.getTime() > Date.now()) {
            throw new NotFoundException(
                `指定された公開済みBlogEntryが見つかりませんでした。blogEntryId: ${blogEntryId}`,
            );
        }

        return foundBlogEntry;
    }

    /**
     * slugで公開されたBlogEntryを取得します。
     */
    async getBySlug(slug: string): Promise<BlogEntryWithRelations> {
        this.logger.log("slugで公開済みBlogEntryを取得します。", {
            slug,
        });

        const found =
            await this.blogEntryQuery.findOnePublishedWithRelationsBySlug(slug);

        if (!found) {
            throw new NotFoundException(
                `指定された公開済みBlogEntryが見つかりませんでした。slug:${slug}`,
            );
        }

        return found;
    }

    /**
     * 指定された公開済みBlogEntryから、指定した個数過去の公開済みBlogEntryを取得します。
     */
    async getEarlier(
        pointerBlogEntryId: number,
        count: number,
    ): Promise<BlogEntryWithRelations | null> {
        this.logger.log(
            "指定されたものより過去の公開済みBlogEntryを取得します。",
            {
                pointerBlogEntryId,
                count,
            },
        );

        const publishAt =
            await this.getPointerPublishAtById(pointerBlogEntryId);
        if (!publishAt) {
            throw new NotFoundException(
                `指定された公開済みBlogEntryが見つかりませんでした。pointerBlogEntryId: ${pointerBlogEntryId}`,
            );
        }

        const foundBlogEntryId = (
            await this.blogEntryQuery.findManyIdsPublishedEarlierByPublishAt(
                publishAt,
                count,
            )
        ).at(-1);

        if (!foundBlogEntryId) {
            return null;
        }

        return await this.getById(foundBlogEntryId);
    }

    /**
     * 指定された公開済みBlogEntryから、指定した個数将来の公開済みBlogEntryを取得します。
     */
    async getLater(
        pointerBlogEntryId: number,
        count: number,
    ): Promise<BlogEntryWithRelations | null> {
        this.logger.log(
            "指定されたものより将来の公開済みBlogEntryを取得します。",
            {
                pointerBlogEntryId,
                count,
            },
        );

        const publishAt =
            await this.getPointerPublishAtById(pointerBlogEntryId);
        if (!publishAt) {
            throw new NotFoundException(
                `指定された公開済みBlogEntryが見つかりませんでした。pointerBlogEntryId: ${pointerBlogEntryId}`,
            );
        }

        const foundBlogEntryId = (
            await this.blogEntryQuery.findManyIdsPublishedEarlierByPublishAt(
                publishAt,
                count,
            )
        ).at(-1);

        if (!foundBlogEntryId) {
            return null;
        }

        return await this.getById(foundBlogEntryId);
    }

    /**
     * 直近に公開されたBlogEntryを取得します。
     */
    async getLatestBlogEntries(
        count: number,
        pointerBlogEntryId?: number,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("直近に公開されたBlogEntryを取得します。", {
            count,
            pointerBlogEntryId,
        });

        const pointerPublishAt =
            pointerBlogEntryId ?
                await this.getPointerPublishAtById(pointerBlogEntryId)
            :   undefined;

        return await this.blogEntryQuery.findManyLatestPublishedWithRelations(
            count,
            pointerPublishAt,
        );
    }

    /**
     * 年度を指定して公開済みBlogEntryを公開逆順に取得します。
     */
    async getBlogEntriesByPublishYear(
        year: number,
        count: number,
        pointerBlogEntryId?: number,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("年度を指定して公開されたBlogEntryを取得します。", {
            year,
            count,
            pointerBlogEntryId,
        });

        const [startOfTargetYear, startOfNextYear] = createJstYearRange(year);

        return await this.getBlogEntriesByRange(
            startOfTargetYear,
            startOfNextYear,
            count,
            pointerBlogEntryId,
        );
    }

    /**
     * 年月を指定して公開済みBlogEntryを公開逆順に取得します。
     */
    async getBlogEntriesByPublishYearMonth(
        year: number,
        month: number,
        count: number,
        pointerBlogEntryId?: number,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("年度を指定して公開されたBlogEntryを取得します。", {
            year,
            month,
            count,
            pointerBlogEntryId,
        });

        const [startOfTargetMonth, startOfNextMonth] = createJstMonthRange(
            year,
            month,
        );

        return this.getBlogEntriesByRange(
            startOfTargetMonth,
            startOfNextMonth,
            count,
            pointerBlogEntryId,
        );
    }

    async getAllPublishAt(): Promise<Date[]> {
        this.logger.log("全ての公開済みBlogEntryの公開日を取得します。");

        return await this.blogEntryQuery.findManyPublishAt();
    }

    /**
     * 公開日の範囲を指定してページング考慮済み公開済みBlogEntryを取得します。
     */
    private async getBlogEntriesByRange(
        searchStartAtGte: Date,
        searchEndAtLt: Date,
        count: number,
        pointerBlogEntryId?: number,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("公開日範囲を指定して公開済みBlogEntryを取得します。", {
            searchStartAtGte,
            searchEndAtLt,
            count,
            pointerBlogEntryId,
        });

        const pointerPublishAt =
            pointerBlogEntryId ?
                await this.getPointerPublishAtById(pointerBlogEntryId)
            :   undefined;
        const searchCount = count + 1;

        const blogEntries = await this.blogEntryQuery.findManyPublishedByRange(
            searchStartAtGte,
            searchEndAtLt,
            searchCount,
            pointerPublishAt,
        );

        if (!blogEntries.length) {
            throw new NotFoundException(
                `指定の検索日時範囲では公開済みBlogEntryが見つかりませんでした。 searchStartAtGte: ${searchStartAtGte}, searchEndAtLt: ${searchEndAtLt}, count: ${count}, pointerBlogEntryId: ${pointerBlogEntryId},`,
            );
        }

        return blogEntries;
    }

    /**
     * BlogEntryIdからページング用の公開日を取得します。
     */
    private async getPointerPublishAtById(
        pointerBlogEntryId: number,
    ): Promise<Date | undefined> {
        this.logger.log("ポインターのBlogEntry公開日を取得します。", {
            pointerBlogEntryId,
        });

        try {
            return (
                (
                    await this.blogEntryService.getByBlogEntryId(
                        pointerBlogEntryId,
                    )
                ).publishAt ?? undefined
            );
        } catch {
            return undefined;
        }
    }
}
