import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryArchivePublishDatesResponse } from "./response/BlogEntryArchivePublishDates.response";

@Controller("public-blog-entry")
export class PublicBlogEntryController {
    constructor(private readonly blogEntryService: BlogEntryService) {}

    @Get("publish-dates")
    @ApiOkResponse({
        type: [BlogEntryArchivePublishDatesResponse],
    })
    async getBlogEntryPublishedDates(): Promise<
        BlogEntryArchivePublishDatesResponse[]
    > {
        return BlogEntryArchivePublishDatesResponse.countFromDates(
            await this.blogEntryService.getAllBlogEntriesPublishAt(),
        );
    }
}
