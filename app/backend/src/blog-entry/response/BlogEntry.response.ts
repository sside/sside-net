import { ApiProperty } from "@nestjs/swagger";
import { BaseIdentifiableResponse } from "../../type/response/BaseIdentifiable.response";
import { BlogEntryWithRelations } from "../query/blog-entry.query";
import { BlogEntryMetaTagResponse } from "./BlogEntryMetaTag.response";

export class BlogEntryResponse extends BaseIdentifiableResponse {
    @ApiProperty()
    slug: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    publishAt: Date;

    @ApiProperty()
    bodyMarkdown: string;

    @ApiProperty({ type: [BlogEntryMetaTagResponse] })
    metaTags: BlogEntryMetaTagResponse[];

    /**
     * BlogEntryWithRelationsからレスポンスを作成します。
     * publishAtはノーチェックなので、呼び出し側が確認すること。
     */
    static fromEntity(blogEntry: BlogEntryWithRelations): BlogEntryResponse {
        const {
            slug,
            publishAt,
            blogEntryMetaTags,
            blogEntryDraft,
            blogEntryHistories,
        } = blogEntry;
        const { title, bodyMarkdown } =
            blogEntryDraft ??
            blogEntryHistories
                .toSorted(
                    ({ createdAt: aCreatedAt }, { createdAt: bCreatedAt }) =>
                        bCreatedAt.getTime() - aCreatedAt.getTime(),
                )
                .at(0)!;

        return {
            ...BaseIdentifiableResponse.fromEntity(blogEntry),
            slug,
            title,
            publishAt: publishAt!,
            bodyMarkdown,
            metaTags: blogEntryMetaTags.map(
                BlogEntryMetaTagResponse.fromEntity,
            ),
        };
    }
}
