import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { BlogEntryService } from "./blog-entry.service";

@Controller("public-blog-entry")
export class PublicBlogEntryController {
    constructor(private readonly blogEntryService: BlogEntryService) {}

    @Get("publish-dates")
    @ApiOkResponse({
        type: [Date],
    })
    async getBlogEntryPublishedDates(): Promise<Date[]> {
        return await this.blogEntryService.getAllBlogEntriesPublishAt();
    }
}
