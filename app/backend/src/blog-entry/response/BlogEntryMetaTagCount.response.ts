import { ApiProperty } from "@nestjs/swagger";
import { BlogEntryMetaTag } from "../../generated/prisma/client.js";
import { BlogEntryMetaTagResponse } from "./BlogEntryMetaTag.response.js";

export class BlogEntryMetaTagCountResponse extends BlogEntryMetaTagResponse {
    @ApiProperty()
    count: number;

    static fromEntityAndCount(
        blogEntryMetaTag: BlogEntryMetaTag,
        count: number,
    ): BlogEntryMetaTagCountResponse {
        return {
            ...BlogEntryMetaTagResponse.fromEntity(blogEntryMetaTag),
            count,
        };
    }
}
