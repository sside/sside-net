import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PagingDirection } from "@sside-net/constant";
import { createJstMonthRange, createJstYearRange } from "@sside-net/date-time";
import {
    BlogEntryQuery,
    BlogEntryWithRelations,
    PublishedBlogEntryWithRelations,
} from "./query/blog-entry.query.js";

@Injectable()
export class PublicBlogEntryService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly blogEntryQuery: BlogEntryQuery) {}

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
                (await this.getBySlug(pointerBlogEntrySlug)).publishAt
            :   undefined;

        return await this.blogEntryQuery.findManyLatestPublishedWithRelations(
            count,
            pointerPublishAt,
        );
    }

    /**
     * 指定された公開済みBlogEntryから、指定した個数前後したものを取得します。
     * 指定した個数よりも手前のものしかない場合、手前のものを返します。
     */
    async getAdjacentLatestBlogEntry(
        pointerBlogEntrySlug: string,
        direction: PagingDirection,
        count: number,
    ): Promise<PublishedBlogEntryWithRelations | null> {
        this.logger.log(
            "指定したものから前後の公開済みBlogEntryを取得します。",
            {
                pointerBlogEntrySlug,
                direction,
                count,
            },
        );

        return (
            (
                await this.blogEntryQuery.findManyAdjacentPublishedByPublishAt(
                    (await this.getBySlug(pointerBlogEntrySlug)).publishAt,
                    count,
                    direction === "later" ? "asc" : "desc",
                )
            ).at(-1) ?? null
        );
    }

    /**
     * 年度を指定して公開済みBlogEntryを公開逆順に取得します。
     */
    async getBlogEntriesByPublishYear(
        year: number,
    ): Promise<PublishedBlogEntryWithRelations[]> {
        this.logger.log("年度を指定して公開されたBlogEntryを取得します。", {
            year,
        });

        const [startOfTargetYear, startOfNextYear] = createJstYearRange(year);

        return await this.blogEntryQuery.findManyPublishedByRange(
            startOfTargetYear,
            startOfNextYear,
        );
    }

    /**
     * 年月を指定して公開済みBlogEntryを公開逆順に取得します。
     */
    async getBlogEntriesByPublishYearMonth(
        year: number,
        month: number,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("年度を指定して公開されたBlogEntryを取得します。", {
            year,
            month,
        });

        const [startOfTargetMonth, startOfNextMonth] = createJstMonthRange(
            year,
            month,
        );

        return this.blogEntryQuery.findManyPublishedByRange(
            startOfTargetMonth,
            startOfNextMonth,
        );
    }

    /**
     * 全ての公開済みBlogEntryの公開日を取得します。
     */
    async getAllPublishAt(): Promise<Date[]> {
        this.logger.log("全ての公開済みBlogEntryの公開日を取得します。");

        return await this.blogEntryQuery.findManyPublishAt();
    }
}
