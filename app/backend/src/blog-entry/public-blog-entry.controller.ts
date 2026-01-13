import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryArchivePublishDatesResponse } from "./response/BlogEntryArchivePublishDates.response";
import { PublishedBlogEntriesResponse } from "./response/PublishedBlogEntries.response";

@Controller("public-blog-entry")
export class PublicBlogEntryController {
    constructor(private readonly blogEntryService: BlogEntryService) {}

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
            blogEntries,
            nextPointerBlogEntry?.id,
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
