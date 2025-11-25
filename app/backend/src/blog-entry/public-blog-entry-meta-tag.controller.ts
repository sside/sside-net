import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import { BlogEntryMetaTagCountResponse } from "./response/BlogEntryMetaTagCount.response";

@Controller("public-blog-entry-meta-tag")
export class PublicBlogEntryMetaTagController {
    constructor(
        private readonly blogEntryMetaTagService: BlogEntryMetaTagService,
    ) {}

    @Get()
    @ApiOkResponse({
        type: [BlogEntryMetaTagCountResponse],
    })
    async getAllPublishedBlogEntryMetaTag(): Promise<
        BlogEntryMetaTagCountResponse[]
    > {
        return (
            await this.blogEntryMetaTagService.getAndCountAllPublishedBlogEntryMetaTags()
        ).map(
            ({
                _count: { blogEntries: blogEntryCount },
                ...blogEntryMetaTag
            }) =>
                BlogEntryMetaTagCountResponse.fromEntityAndCount(
                    blogEntryMetaTag,
                    blogEntryCount,
                ),
        );
    }
}
