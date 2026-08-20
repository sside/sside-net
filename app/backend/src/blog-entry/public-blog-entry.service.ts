import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { createJstMonthRange, createJstYearRange } from "@sside-net/date-time";
import { BlogEntryService } from "./blog-entry.service";
import {
    BlogEntryQuery,
    BlogEntryWithRelations,
    PublishedBlogEntryWithRelations,
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
    async getById(
        blogEntryId: number,
    ): Promise<PublishedBlogEntryWithRelations> {
        this.logger.log("idで公開済みBlogEntryを取得します。", {
            blogEntryId,
        });

        const found =
            await this.blogEntryQuery.findOnePublishedWithRelationsByBlogEntryId(
                blogEntryId,
            );

        if (!found) {
            throw new NotFoundException(
                `指定された公開済みBlogEntryが見つかりませんでした。blogEntryId: ${blogEntryId}`,
            );
        }

        return found;
    }

    /**
     * slugで公開されたBlogEntryを取得します。
     */
    async getBySlug(slug: string): Promise<PublishedBlogEntryWithRelations> {
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
        pointerBlogEntrySlug: string,
        count: number,
    ): Promise<PublishedBlogEntryWithRelations | null> {
        this.logger.log(
            "指定されたものより過去の公開済みBlogEntryを取得します。",
            {
                pointerBlogEntrySlug,
            },
        );

        return (
            (
                await this.blogEntryQuery.findManyIdsPublishedEarlierByPublishAt(
                    (await this.getBySlug(pointerBlogEntrySlug)).publishAt,
                    count,
                )
            )?.at(-1) ?? null
        );
    }

    /**
     * 指定された公開済みBlogEntryから、指定した個数将来の公開済みBlogEntryを取得します。
     */
    async getLater(
        pointerBlogEntrySlug: string,
        count: number,
    ): Promise<PublishedBlogEntryWithRelations | null> {
        this.logger.log(
            "指定されたものより将来の公開済みBlogEntryを取得します。",
            {
                pointerBlogEntrySlug,
            },
        );

        return (
            (
                await this.blogEntryQuery.findManyIdsPublishedLaterByPublishAt(
                    (await this.getBySlug(pointerBlogEntrySlug)).publishAt,
                    count,
                )
            )?.at(-1) ?? null
        );
    }

    /**
     * 直近に公開されたBlogEntryを取得します。
     */
    async getLatestBlogEntries(
        count: number,
        pointerBlogEntrySlug?: string,
    ): Promise<PublishedBlogEntryWithRelations[]> {
        this.logger.log("直近に公開されたBlogEntryを取得します。", {
            count,
            pointerBlogEntrySlug,
        });

        const pointerPublishAt =
            pointerBlogEntrySlug ?
                await this.getPointerPublishAtBySlug(pointerBlogEntrySlug)
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
        pointerBlogEntrySlug?: string,
    ): Promise<PublishedBlogEntryWithRelations[]> {
        this.logger.log("年度を指定して公開されたBlogEntryを取得します。", {
            year,
            count,
            pointerBlogEntrySlug,
        });

        const [startOfTargetYear, startOfNextYear] = createJstYearRange(year);

        return await this.getBlogEntriesByRange(
            startOfTargetYear,
            startOfNextYear,
            count,
            pointerBlogEntrySlug,
        );
    }

    /**
     * 年月を指定して公開済みBlogEntryを公開逆順に取得します。
     */
    async getBlogEntriesByPublishYearMonth(
        year: number,
        month: number,
        count: number,
        pointerBlogEntrySlug?: string,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("年度を指定して公開されたBlogEntryを取得します。", {
            year,
            month,
            count,
            pointerBlogEntrySlug,
        });

        const [startOfTargetMonth, startOfNextMonth] = createJstMonthRange(
            year,
            month,
        );

        return this.getBlogEntriesByRange(
            startOfTargetMonth,
            startOfNextMonth,
            count,
            pointerBlogEntrySlug,
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
        pointerBlogEntrySlug?: string,
    ): Promise<PublishedBlogEntryWithRelations[]> {
        this.logger.log("公開日範囲を指定して公開済みBlogEntryを取得します。", {
            searchStartAtGte,
            searchEndAtLt,
            count,
            pointerBlogEntrySlug,
        });

        const pointerPublishAt =
            pointerBlogEntrySlug ?
                await this.getPointerPublishAtBySlug(pointerBlogEntrySlug)
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
                `指定の検索日時範囲では公開済みBlogEntryが見つかりませんでした。 searchStartAtGte: ${searchStartAtGte}, searchEndAtLt: ${searchEndAtLt}, count: ${count}, pointerBlogEntryId: ${pointerBlogEntrySlug},`,
            );
        }

        return blogEntries;
    }

    /**
     * BlogEntryIdからページング用の公開日を取得します。
     */
    private async getPointerPublishAtBySlug(
        pointerBlogEntrySlug: string,
    ): Promise<Date | undefined> {
        this.logger.log("ポインターのBlogEntry公開日を取得します。", {
            pointerBlogEntrySlug,
        });

        try {
            return (
                (await this.getBySlug(pointerBlogEntrySlug)).publishAt ??
                undefined
            );
        } catch {
            return undefined;
        }
    }
}
