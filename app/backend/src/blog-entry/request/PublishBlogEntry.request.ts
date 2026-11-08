import { ApiPropertyOptional } from "@nestjs/swagger";
import { BlogEntryRequest } from "./BlogEntry.request.js";

export class PublishBlogEntryRequest extends BlogEntryRequest {
    @ApiPropertyOptional()
    publishAt?: Date;
}
