import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { setJst } from "@sside-net/date-time";
import { DateTime } from "luxon";
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
     */
    async getLatestPublishedBlogEntries(
        count: number,
        pointerBlogEntryId?: number,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("直近に公開されたBlogEntryを取得します。", {
            count,
            pointerBlogEntryId,
        });

        const pointerPublishAt =
            pointerBlogEntryId ?
                await this.getPointerBlogEntryPublishAt(pointerBlogEntryId)
            :   undefined;

        return await this.blogEntryQuery.findManyLatestPublishedWithRelations(
            count,
            pointerPublishAt,
        );
    }

    /**
     * 年度を指定して公開済みBlogEntryを公開逆順に取得します。
     */
    async getPublishedBlogEntriesByPublishYear(
        year: number,
        count: number,
        pointerBlogEntryId?: number,
    ): Promise<BlogEntryWithRelations[]> {
        this.logger.log("年度を指定して公開されたBlogEntryを取得します。", {
            year,
            count,
            pointerBlogEntryId,
        });

        const startOfTargetYear = setJst(
            DateTime.fromObject({
                year,
                day: 2,
            }),
        ).startOf("year");

        return await this.getPublishedBlogEntriesByRange(
            startOfTargetYear.toJSDate(),
            startOfTargetYear
                .plus({
                    year: 1,
                })
                .toJSDate(),
            count,
            pointerBlogEntryId,
        );
    }

    /**
     * 年月を指定して公開済みBlogEntryを公開逆順に取得します。
     */
    async getPublishedBlogEntriesByPublishYearMonth(
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

        const startOfTargetMonth = setJst(
            DateTime.fromObject({
                year,
                month,
                day: 2,
            }),
        ).startOf("month");

        return this.getPublishedBlogEntriesByRange(
            startOfTargetMonth.toJSDate(),
            startOfTargetMonth
                .plus({
                    month: 1,
                })
                .toJSDate(),
            count,
            pointerBlogEntryId,
        );
    }

    async getAllBlogEntriesPublishAt(): Promise<Date[]> {
        this.logger.log("全ての公開済みBlogEntryの公開日を取得します。");

        return await this.blogEntryQuery.findManyPublishAt();
    }

    /**
     * Dateで範囲を指定してページング考慮済み公開済みBlogEntryを取得します。
     */
    private async getPublishedBlogEntriesByRange(
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
                await this.getPointerBlogEntryPublishAt(pointerBlogEntryId)
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
    private async getPointerBlogEntryPublishAt(
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
