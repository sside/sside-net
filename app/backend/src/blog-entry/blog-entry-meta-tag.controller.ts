import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from "@nestjs/common";
import {
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
} from "@nestjs/swagger";
import { SignedIn } from "../authentication/decorator/signed-in.decorator.js";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service.js";
import { BlogEntryMetaTagRequest } from "./request/BlogEntryMetaTag.request.js";
import { BlogEntryMetaTagResponse } from "./response/BlogEntryMetaTag.response.js";
import { BlogEntryMetaTagCountResponse } from "./response/BlogEntryMetaTagCount.response.js";

@Controller("private/blog-entry-meta-tag")
@SignedIn()
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

    @Post()
    @ApiCreatedResponse({
        type: BlogEntryMetaTagResponse,
    })
    async postCreateBlogEntryMetaTag(
        @Body() { name }: BlogEntryMetaTagRequest,
    ): Promise<BlogEntryMetaTagResponse> {
        return BlogEntryMetaTagResponse.fromEntity(
            await this.blogEntryMetaTagService.getOrCreateByName(name),
        );
    }

    @Put(":blogEntryMetaTagId")
    @ApiOkResponse({
        type: BlogEntryMetaTagResponse,
    })
    async putUpdateBlogEntryMetaTag(
        @Body() { name }: BlogEntryMetaTagRequest,
        @Param("blogEntryMetaTagId", ParseIntPipe) blogEntryMetaTagId: number,
    ): Promise<BlogEntryMetaTagResponse> {
        return BlogEntryMetaTagResponse.fromEntity(
            await this.blogEntryMetaTagService.updateName(
                blogEntryMetaTagId,
                name,
            ),
        );
    }

    @Delete(":blogEntryMetaTagId")
    @ApiNoContentResponse()
    async deleteBlogEntryMetaTag(
        @Param("blogEntryMetaTagId", ParseIntPipe) blogEntryMetaTagId: number,
    ): Promise<void> {
        await this.blogEntryMetaTagService.remove(blogEntryMetaTagId);

        return;
    }
}
