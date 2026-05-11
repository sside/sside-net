import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { getAppConfig } from "@sside-net/app-config";
import { MonthValidationPipe } from "../library/pipe/month-validation.pipe";
import { NumberLimitationPipe } from "../library/pipe/number-limitation.pipe";
import { YearValidationPipe } from "../library/pipe/year-validation.pipe";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryArchivePublishDatesResponse } from "./response/BlogEntryArchivePublishDates.response";
import { PublishedBlogEntriesResponse } from "./response/PublishedBlogEntries.response";
import { PublishedBlogEntryResponse } from "./response/PublishedBlogEntry.response";

@Controller("public-blog-entry")
export class PublicBlogEntryController {
    constructor(
        private readonly blogEntryService: BlogEntryService,
        private readonly blogEntryMetaTagService: BlogEntryMetaTagService,
    ) {}

    @Get("latest")
    @ApiOkResponse({
        type: PublishedBlogEntriesResponse,
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
    ): Promise<PublishedBlogEntriesResponse> {
        const [blogEntries, nextPointerBlogEntry] =
            await this.blogEntryService.getLatestPublishedBlogEntries(
                count,
                pointerBlogEntryId,
            );

        return PublishedBlogEntriesResponse.fromEntities(
            await Promise.all(
                blogEntries.map(async (blogEntry) => [
                    blogEntry,
                    await this.blogEntryMetaTagService.getAndCountPublishedBlogEntryMetaTagsByBlogEntryMetaTagIds(
                        blogEntry.blogEntryMetaTags.map(({ id }) => id),
                    ),
                ]),
            ),
            nextPointerBlogEntry?.id,
        );
    }

    @Get("slug/:slug")
    @ApiOkResponse({ type: PublishedBlogEntryResponse })
    async getBlogEntryBySlug(
        @Param("slug") slug: string,
    ): Promise<PublishedBlogEntryResponse> {
        const blogEntry = await this.blogEntryService.getPublishedBySlug(slug);

        return PublishedBlogEntryResponse.fromEntities(
            blogEntry,
            await this.blogEntryMetaTagService.getAndCountPublishedBlogEntryMetaTagsByBlogEntryMetaTagIds(
                blogEntry.blogEntryMetaTags.map(({ id }) => id),
            ),
        );
    }

    @Get("archive/:year")
    @ApiOkResponse({
        type: PublishedBlogEntriesResponse,
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
    ): Promise<PublishedBlogEntriesResponse> {
        const [blogEntries, nextPointer] =
            await this.blogEntryService.getPublishedBlogEntriesByPublishYear(
                year,
                count,
                pointerBlogEntryId,
            );

        return PublishedBlogEntriesResponse.fromEntities(
            await Promise.all(
                blogEntries.map(async (blogEntry) => [
                    blogEntry,
                    await this.blogEntryMetaTagService.getAndCountPublishedBlogEntryMetaTagsByBlogEntryMetaTagIds(
                        blogEntry.blogEntryMetaTags.map(({ id }) => id),
                    ),
                ]),
            ),
            nextPointer?.id,
        );
    }

    @Get("archive/:year/:month")
    @ApiOkResponse({
        type: PublishedBlogEntriesResponse,
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
    ): Promise<PublishedBlogEntriesResponse> {
        const [blogEntries, nextPointer] =
            await this.blogEntryService.getPublishedBlogEntriesByPublishYear(
                year,
                count,
                pointerBlogEntryId,
            );

        return PublishedBlogEntriesResponse.fromEntities(
            await Promise.all(
                blogEntries.map(async (blogEntry) => [
                    blogEntry,
                    await this.blogEntryMetaTagService.getAndCountPublishedBlogEntryMetaTagsByBlogEntryMetaTagIds(
                        blogEntry.blogEntryMetaTags.map(({ id }) => id),
                    ),
                ]),
            ),
            nextPointer?.id,
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
            await this.blogEntryService.getAllBlogEntriesPublishAt(),
        );
    }
}
