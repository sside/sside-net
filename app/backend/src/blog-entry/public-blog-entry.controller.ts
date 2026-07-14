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
import { Response as ExpressResponse } from "express";
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
                await this.publicBlogEntryService.getLatestBlogEntries(
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
        const blogEntry = await this.publicBlogEntryService.getBySlug(slug);

        return PublishedBlogEntryResponse.fromEntities(
            blogEntry,
            await this.blogEntryMetaTagService.getAndCountPublishedByIds(
                blogEntry.blogEntryMetaTags.map(({ id }) => id),
            ),
        );
    }

    @Get("earlier")
    @ApiOkResponse({
        type: PublishedBlogEntryResponse,
    })
    @ApiNoContentResponse({
        description: "指定より過去に公開済みBlogEntryがない場合に返ります。",
    })
    @ApiQuery({
        name: "pointer-blog-entry-id",
        type: Number,
        required: false,
    })
    async getEarlier(
        @Res() res: ExpressResponse,
        @Query("pointer-blog-entry-id", ParseIntPipe)
        pointerBlogEntryId: number,
        @Query(
            "count",
            new NumberLimitationPipe(
                getAppConfig().backend.blogEntry.public
                    .maximumFetchCountPerOnce,
            ),
        )
        count: number,
    ): Promise<PublishedBlogEntryResponse | null> {
        const earlierBlogEntry = await this.publicBlogEntryService.getEarlier(
            pointerBlogEntryId,
            count,
        );

        return earlierBlogEntry ?
                PublishedBlogEntryResponse.fromEntities(
                    earlierBlogEntry,
                    await this.blogEntryMetaTagService.getAndCountPublishedByIds(
                        earlierBlogEntry.blogEntryMetaTags.map(({ id }) => id),
                    ),
                )
            :   (res.status(HttpStatus.NO_CONTENT).send() as unknown as null);
    }

    @Get("later")
    @ApiOkResponse({
        type: PublishedBlogEntryResponse,
    })
    @ApiNoContentResponse({
        description: "指定より将来に公開済みBlogEntryがない場合に返ります。",
    })
    @ApiQuery({
        name: "pointer-blog-entry-id",
        type: Number,
        required: false,
    })
    async getLater(
        @Res() res: ExpressResponse,
        @Query("pointer-blog-entry-id", ParseIntPipe)
        pointerBlogEntryId: number,
        @Query(
            "count",
            new NumberLimitationPipe(
                getAppConfig().backend.blogEntry.public
                    .maximumFetchCountPerOnce,
            ),
        )
        count: number,
    ): Promise<PublishedBlogEntryResponse | null> {
        const laterBlogEntry = await this.publicBlogEntryService.getLater(
            pointerBlogEntryId,
            count,
        );

        return laterBlogEntry ?
                PublishedBlogEntryResponse.fromEntities(
                    laterBlogEntry,
                    await this.blogEntryMetaTagService.getAndCountPublishedByIds(
                        laterBlogEntry.blogEntryMetaTags.map(({ id }) => id),
                    ),
                )
            :   (res.status(HttpStatus.NO_CONTENT).send() as unknown as null);
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
                await this.publicBlogEntryService.getBlogEntriesByPublishYear(
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
                await this.publicBlogEntryService.getBlogEntriesByPublishYearMonth(
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
            await this.publicBlogEntryService.getAllPublishAt(),
        );
    }
}
