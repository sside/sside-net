import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class TokenRefreshRequest {
    @ApiProperty()
    @IsString()
    @MaxLength(256)
    refreshToken: string;
}
