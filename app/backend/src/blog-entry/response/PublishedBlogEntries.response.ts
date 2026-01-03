import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BlogEntryWithRelations } from "../query/blog-entry.query";
import { BlogEntryResponse } from "./BlogEntry.response";

export class PublishedBlogEntriesResponse {
    @ApiProperty({
        type: [BlogEntryResponse],
    })
    blogEntries: BlogEntryResponse[];

    @ApiPropertyOptional()
    nextPointerBlogEntryId?: number;

    static fromEntities(
        publishedBlogEntries: BlogEntryWithRelations[],
        nextPointerBlogEntryId?: number,
    ): PublishedBlogEntriesResponse {
        return {
            blogEntries: publishedBlogEntries.map(BlogEntryResponse.fromEntity),
            nextPointerBlogEntryId,
        };
    }
}
