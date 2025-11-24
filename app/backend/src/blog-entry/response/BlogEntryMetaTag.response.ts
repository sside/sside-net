import { ApiProperty } from "@nestjs/swagger";
import { BlogEntryMetaTag } from "../../generated/prisma/client";

export class BlogEntryMetaTagResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    static fromEntity({
        id,
        name,
    }: BlogEntryMetaTag): BlogEntryMetaTagResponse {
        return {
            id,
            name,
        };
    }
}
