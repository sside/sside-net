import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryRequest } from "./request/BlogEntry.request";
import { PublishBlogEntryRequest } from "./request/PublishBlogEntry.request";
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

    @Post("draft")
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        type: [BlogEntryResponse],
    })
    async postCreateBlogEntryDraft(
        @Body() { blogEntryMetaTagNames, ...blogEntry }: BlogEntryRequest,
    ): Promise<BlogEntryResponse> {
        return BlogEntryResponse.fromEntity(
            await this.blogEntryService.createDraft(
                blogEntry,
                blogEntryMetaTagNames,
            ),
        );
    }

    @Post("publish")
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        type: [BlogEntryResponse],
    })
    async postCreatePublishedBlogEntry(
        @Body()
        {
            publishAt,
            blogEntryMetaTagNames,
            ...blogEntry
        }: PublishBlogEntryRequest,
    ) {
        return BlogEntryResponse.fromEntity(
            await this.blogEntryService.createPublished(
                blogEntry,
                blogEntryMetaTagNames,
                publishAt,
            ),
        );
    }

    @Put(":blogEntryId/draft")
    @ApiOkResponse({
        type: [BlogEntryResponse],
    })
    async putUpdateBlogEntryDraft(
        @Param("blogEntryId", ParseIntPipe) blogEntryId: number,
        @Body() { blogEntryMetaTagNames, ...blogEntry }: BlogEntryRequest,
    ): Promise<BlogEntryResponse> {
        return BlogEntryResponse.fromEntity(
            await this.blogEntryService.updateDraft(
                blogEntryId,
                blogEntry,
                blogEntryMetaTagNames,
            ),
        );
    }

    @Put(":blogEntryId/publish")
    @ApiOkResponse({
        type: [BlogEntryResponse],
    })
    async putPublishBlogEntry(
        @Param("blogEntryId", ParseIntPipe) blogEntryId: number,
        @Body()
        {
            blogEntryMetaTagNames,
            publishAt,
            ...blogEntry
        }: PublishBlogEntryRequest,
    ): Promise<BlogEntryResponse> {
        return BlogEntryResponse.fromEntity(
            await this.blogEntryService.publishBlogEntryDraft(
                (
                    await this.blogEntryService.updateDraft(
                        blogEntryId,
                        blogEntry,
                        blogEntryMetaTagNames,
                    )
                ).id,
                publishAt,
            ),
        );
    }
}
