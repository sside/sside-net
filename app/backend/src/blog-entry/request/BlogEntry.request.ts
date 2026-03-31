import { ApiProperty } from "@nestjs/swagger";

export class BlogEntryRequest {
    @ApiProperty()
    slug: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    bodyMarkdown: string;

    @ApiProperty()
    blogEntryMetaTagNames: string[];
}
