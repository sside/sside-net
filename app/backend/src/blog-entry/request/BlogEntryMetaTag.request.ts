import { ApiProperty } from "@nestjs/swagger";
import { getAppConfig } from "@sside-net/app-config";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class BlogEntryMetaTagRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(getAppConfig().blog.validation.metaTag.maxLength)
    name: string;
}
