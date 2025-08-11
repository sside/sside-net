import { ApiProperty } from "@nestjs/swagger";
import { BaseIdentifiableItemResponse } from "../../type/response/BaseIdentifiableItemResponse";
import { BlogEntryMetaTagResponse } from "../../type/response/BlogEntryMetaTagResponse";
import { BlogEntryWithRelations } from "../query/blog-entry.query";

export class BlogEntryResponse extends BaseIdentifiableItemResponse {
    @ApiProperty()
    slug: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    bodyMarkdown: string;

    @ApiProperty({ type: [BlogEntryMetaTagResponse] })
    metaTags: BlogEntryMetaTagResponse[];

    static fromEntity(blogEntry: BlogEntryWithRelations): BlogEntryResponse {
        const { slug, blogEntryMetaTags, blogEntryDraft, blogEntryHistories } =
            blogEntry;
        const { title, bodyMarkdown } =
            blogEntryDraft ??
            blogEntryHistories
                .toSorted(
                    ({ createdAt: aCreatedAt }, { createdAt: bCreatedAt }) =>
                        bCreatedAt.getTime() - aCreatedAt.getTime(),
                )
                .at(0)!;

        return {
            ...BaseIdentifiableItemResponse.fromEntity(blogEntry),
            slug,
            title,
            bodyMarkdown,
            metaTags: blogEntryMetaTags.map(
                BlogEntryMetaTagResponse.fromEntity,
            ),
        };
    }
}
