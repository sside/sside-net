import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import { BlogEntryMetaTagResponse } from "./response/BlogEntryMetaTag.response";

@Controller("public-blog-entry-meta-tag")
export class PublicBlogEntryMetaTagController {
    constructor(
        private readonly blogEntryMetaTagService: BlogEntryMetaTagService,
    ) {}

    @Get()
    @ApiOkResponse({
        type: [BlogEntryMetaTagResponse],
    })
    async getAllPublishedBlogEntryMetaTag(): Promise<
        BlogEntryMetaTagResponse[]
    > {
        return (
            await this.blogEntryMetaTagService.getAllPublishedBlogEntryMetaTags()
        ).map(BlogEntryMetaTagResponse.fromEntity);
    }
}
