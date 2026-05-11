import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { getAppConfig } from "@sside-net/app-config";
import { MonthValidationPipe } from "../library/pipe/month-validation.pipe";
import { NumberLimitationPipe } from "../library/pipe/number-limitation.pipe";
import { YearValidationPipe } from "../library/pipe/year-validation.pipe";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import { PublicBlogEntryService } from "./public-blog-entry.service";
import { BlogEntryArchivePublishDatesResponse } from "./response/BlogEntryArchivePublishDates.response";
import { PublishedBlogEntryResponse } from "./response/PublishedBlogEntry.response";

@Controller("public-blog-entry")
export class PublicBlogEntryController {
    constructor(
        private readonly publicBlogEntryService: PublicBlogEntryService,
        private readonly blogEntryMetaTagService: BlogEntryMetaTagService,
    ) {}

    @Get("latest")
    @ApiOkResponse({
        type: [PublishedBlogEntryResponse],
    })
    @ApiQuery({
        name: "pointer-blog-entry-id",
        type: Number,
        required: false,
    })
    async getLatestBlogEntries(
        @Query("count", ParseIntPipe) count: number,
        @Query(
            "pointer-blog-entry-id",
            new ParseIntPipe({
                optional: true,
            }),
        )
        pointerBlogEntryId?: number,
    ): Promise<PublishedBlogEntryResponse[]> {
        return await Promise.all(
            (
                await this.publicBlogEntryService.getLatestPublishedBlogEntries(
                    count,
                    pointerBlogEntryId,
                )
            ).map(async (blogEntry) =>
                PublishedBlogEntryResponse.fromEntities(
                    blogEntry,
                    await this.blogEntryMetaTagService.getAndCountPublishedByIds(
                        blogEntry.blogEntryMetaTags.map(({ id }) => id),
                    ),
                ),
            ),
        );
    }

    @Get("slug/:slug")
    @ApiOkResponse({
        type: PublishedBlogEntryResponse,
    })
    async getBlogEntryBySlug(
        @Param("slug") slug: string,
    ): Promise<PublishedBlogEntryResponse> {
        const blogEntry =
            await this.publicBlogEntryService.getPublishedBySlug(slug);

        return PublishedBlogEntryResponse.fromEntities(
            blogEntry,
            await this.blogEntryMetaTagService.getAndCountPublishedByIds(
                blogEntry.blogEntryMetaTags.map(({ id }) => id),
            ),
        );
    }

    @Get("archive/:year")
    @ApiOkResponse({
        type: [PublishedBlogEntryResponse],
    })
    @ApiQuery({
        name: "pointer-blog-entry-id",
        type: Number,
        required: false,
    })
    async getBlogEntryArchiveByYear(
        @Param("year", YearValidationPipe) year: number,
        @Query(
            "count",
            new NumberLimitationPipe(
                getAppConfig().backend.blogEntry.public
                    .maximumFetchCountPerOnce,
            ),
        )
        count: number,
        @Query(
            "pointer-blog-entry-id",
            new ParseIntPipe({
                optional: true,
            }),
        )
        pointerBlogEntryId?: number,
    ): Promise<PublishedBlogEntryResponse[]> {
        return Promise.all(
            (
                await this.publicBlogEntryService.getPublishedBlogEntriesByPublishYear(
                    year,
                    count,
                    pointerBlogEntryId,
                )
            ).map(async (blogEntry) =>
                PublishedBlogEntryResponse.fromEntities(
                    blogEntry,
                    await this.blogEntryMetaTagService.getAndCountPublishedByIds(
                        blogEntry.blogEntryMetaTags.map(({ id }) => id),
                    ),
                ),
            ),
        );
    }

    @Get("archive/:year/:month")
    @ApiOkResponse({
        type: [PublishedBlogEntryResponse],
    })
    @ApiQuery({
        name: "pointer-blog-entry-id",
        type: Number,
        required: false,
    })
    async getBlogEntryArchiveByYearMonth(
        @Param("year", YearValidationPipe) year: number,
        @Param("month", MonthValidationPipe) month: number,
        @Query(
            "count",
            new NumberLimitationPipe(
                getAppConfig().backend.blogEntry.public
                    .maximumFetchCountPerOnce,
            ),
        )
        count: number,
        @Query(
            "pointer-blog-entry-id",
            new ParseIntPipe({
                optional: true,
            }),
        )
        pointerBlogEntryId?: number,
    ): Promise<PublishedBlogEntryResponse[]> {
        return Promise.all(
            (
                await this.publicBlogEntryService.getPublishedBlogEntriesByPublishYearMonth(
                    year,
                    month,
                    count,
                    pointerBlogEntryId,
                )
            ).map(async (blogEntry) =>
                PublishedBlogEntryResponse.fromEntities(
                    blogEntry,
                    await this.blogEntryMetaTagService.getAndCountPublishedByIds(
                        blogEntry.blogEntryMetaTags.map(({ id }) => id),
                    ),
                ),
            ),
        );
    }

    @Get("archive-year-month")
    @ApiOkResponse({
        type: [BlogEntryArchivePublishDatesResponse],
    })
    async getBlogEntryArchiveYearMonths(): Promise<
        BlogEntryArchivePublishDatesResponse[]
    > {
        return BlogEntryArchivePublishDatesResponse.countFromDates(
            await this.publicBlogEntryService.getAllBlogEntriesPublishAt(),
        );
    }
}
