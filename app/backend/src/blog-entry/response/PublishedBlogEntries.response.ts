import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BlogEntryMetaTagCountBlogEntry } from "../query/blog-entry-meta-tag.query.js";
import { BlogEntryWithRelations } from "../query/blog-entry.query.js";
import { PublishedBlogEntryResponse } from "./PublishedBlogEntry.response.js";

export class PublishedBlogEntriesResponse {
    @ApiProperty({
        type: [PublishedBlogEntryResponse],
    })
    blogEntries: PublishedBlogEntryResponse[];

    @ApiPropertyOptional()
    nextPointerBlogEntryId?: number;

    static fromEntities(
        publishedBlogEntryAndMetaTags: [
            BlogEntryWithRelations,
            BlogEntryMetaTagCountBlogEntry[],
        ][],
        nextPointerBlogEntryId?: number,
    ): PublishedBlogEntriesResponse {
        return {
            blogEntries: publishedBlogEntryAndMetaTags.map(
                ([blogEntry, metaTagAndCounts]) =>
                    PublishedBlogEntryResponse.fromEntities(
                        blogEntry,
                        metaTagAndCounts,
                    ),
            ),
            nextPointerBlogEntryId,
        };
    }
}
