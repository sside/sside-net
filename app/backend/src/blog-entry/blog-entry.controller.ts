import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryResponse } from "./response/BlogEntry.response";

@Controller("blog-entry")
export class BlogEntryController {
    constructor(private readonly blogEntryService: BlogEntryService) {}

    @Get("")
    @ApiOkResponse({
        type: [BlogEntryResponse],
    })
    async getAllBlogEntries(): Promise<BlogEntryResponse[]> {
        return (await this.blogEntryService.getAll()).map(
            BlogEntryResponse.fromEntity,
        );
    }

    @Get(":blogEntryId")
    @ApiOkResponse({
        type: BlogEntryResponse,
    })
    async getByBlogEntryId(
        @Param("blogEntryId", ParseIntPipe) blogEntryId: number,
    ): Promise<BlogEntryResponse> {
        return BlogEntryResponse.fromEntity(
            await this.blogEntryService.getByBlogEntryId(blogEntryId),
        );
    }
}
