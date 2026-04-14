import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import { BlogEntryMetaTagCountResponse } from "./response/BlogEntryMetaTagCount.response";

@Controller("blog-entry-meta-tag")
export class BlogEntryMetaTagController {
    constructor(
        private readonly blogEntryMetaTagService: BlogEntryMetaTagService,
    ) {}

    @Get()
    @ApiOkResponse({
        type: [BlogEntryMetaTagCountResponse],
    })
    async getAllWithCount(): Promise<BlogEntryMetaTagCountResponse[]> {
        return (
            await this.blogEntryMetaTagService.getAndCountAllWithBlogEntryCount()
        ).map(({ _count: { blogEntries: count }, ...blogEntryMetaTag }) =>
            BlogEntryMetaTagCountResponse.fromEntityAndCount(
                blogEntryMetaTag,
                count,
            ),
        );
    }
}
