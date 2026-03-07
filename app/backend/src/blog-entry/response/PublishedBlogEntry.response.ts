import { InternalServerErrorException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BlogEntryMetaTagCountBlogEntry } from "../query/blog-entry-meta-tag.query";
import { BlogEntryWithRelations } from "../query/blog-entry.query";
import { BlogEntryMetaTagCountResponse } from "./BlogEntryMetaTagCount.response";

export class PublishedBlogEntryResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    publishAt: Date;

    @ApiProperty()
    bodyMarkdown: string;

    @ApiProperty({
        type: [BlogEntryMetaTagCountResponse],
    })
    metaTags: BlogEntryMetaTagCountResponse[];

    @ApiPropertyOptional()
    updatedAt?: Date;

    static fromEntities(
        {
            id,
            createdAt,
            updatedAt,
            publishAt,
            slug,
            blogEntryHistories,
        }: BlogEntryWithRelations,
        metaTagAndCounts: BlogEntryMetaTagCountBlogEntry[],
    ): PublishedBlogEntryResponse {
        if (!publishAt) {
            throw new InternalServerErrorException(
                `公開日のないBlogEntryを公開しようとしています。blogEntryId:${id}`,
            );
        }
        if (!blogEntryHistories.length) {
            throw new InternalServerErrorException(
                `公開する編集履歴のないBlogEntryを公開しようとしています。blogEntryId:${id}`,
            );
        }
        const { title, bodyMarkdown } = blogEntryHistories
            .toSorted(
                ({ createdAt: a }, { createdAt: b }) =>
                    b.getTime() - a.getTime(),
            )
            .at(0)!;

        return {
            id,
            createdAt,
            updatedAt,
            publishAt,
            slug,
            title,
            bodyMarkdown,
            metaTags: metaTagAndCounts.map(({ _count, ...blogMetaTag }) =>
                BlogEntryMetaTagCountResponse.fromEntityAndCount(
                    blogMetaTag,
                    _count.blogEntries,
                ),
            ),
        };
    }
}
