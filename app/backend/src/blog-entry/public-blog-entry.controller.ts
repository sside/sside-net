import {
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Query,
    Res,
} from "@nestjs/common";
import { ApiNoContentResponse, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { getAppConfig } from "@sside-net/app-config";
import { PagingDirection } from "@sside-net/constant";
import { Response as ExpressResponse } from "express";
import { EnumValidationPipe } from "../library/pipe/enum-validation.pipe";
import { MonthValidationPipe } from "../library/pipe/month-validation.pipe";
import { NumberLimitationPipe } from "../library/pipe/number-limitation.pipe";
import { YearValidationPipe } from "../library/pipe/year-validation.pipe";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import { PublicBlogEntryService } from "./public-blog-entry.service";
import { BlogEntryArchivePublishDatesResponse } from "./response/BlogEntryArchivePublishDates.response";
import { PublishedBlogEntryResponse } from "./response/PublishedBlogEntry.response";

@Controller("blog-entry")
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
        name: "pointer-blog-entry-slug",
        required: false,
    })
    async getLatestBlogEntries(
        @Query("count", ParseIntPipe) count: number,
        @Query("pointer-blog-entry-slug")
        pointerBlogEntrySlug?: string,
    ): Promise<PublishedBlogEntryResponse[]> {
        return await Promise.all(
            (
                await this.publicBlogEntryService.getLatestBlogEntries(
                    count,
                    pointerBlogEntrySlug,
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

    @Get("latest/adjecent/:direction")
    @ApiOkResponse({
        type: [PublishedBlogEntryResponse],
    })
    @ApiNoContentResponse({
        description: "指定した方向に公開済みBlogEntryがない場合に返ります。",
    })
    @ApiQuery({
        name: "pointer-blog-entry-slug",
    })
    @ApiQuery({
        name: "count",
        type: Number,
    })
    async getAdjacentLatestBlogEntries(
        @Res({
            passthrough: true,
        })
        res: ExpressResponse,
        @Query("pointer-blog-entry-slug")
        pointerBlogEntrySlug: string,
        @Query(
            "count",
            new NumberLimitationPipe(
                getAppConfig().backend.blogEntry.public
                    .maximumFetchCountPerOnce,
            ),
        )
        count: number,
        @Param(
            "direction",
            new EnumValidationPipe(Object.values(PagingDirection)),
        )
        direction: PagingDirection,
    ): Promise<PublishedBlogEntryResponse | null> {
        const found =
            await this.publicBlogEntryService.getAdjacentLatestBlogEntry(
                pointerBlogEntrySlug,
                direction,
                count,
            );

        if (!found) {
            res.status(HttpStatus.NO_CONTENT);

            return null;
        }

        return PublishedBlogEntryResponse.fromEntities(
            found,
            await this.blogEntryMetaTagService.getAndCountPublishedByIds(
                found.blogEntryMetaTags.map(({ id }) => id),
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
        const blogEntry = await this.publicBlogEntryService.getBySlug(slug);

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
        name: "pointer-blog-entry-slug",
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
        @Query("pointer-blog-entry-slug")
        pointerBlogEntrySlug?: string,
    ): Promise<PublishedBlogEntryResponse[]> {
        return Promise.all(
            (
                await this.publicBlogEntryService.getBlogEntriesByPublishYear(
                    year,
                    count,
                    pointerBlogEntrySlug,
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
        name: "pointer-blog-entry-slug",
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
        @Query("pointer-blog-entry-slug")
        pointerBlogEntrySlug?: string,
    ): Promise<PublishedBlogEntryResponse[]> {
        return Promise.all(
            (
                await this.publicBlogEntryService.getBlogEntriesByPublishYearMonth(
                    year,
                    month,
                    count,
                    pointerBlogEntrySlug,
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
            await this.publicBlogEntryService.getAllPublishAt(),
        );
    }
}
