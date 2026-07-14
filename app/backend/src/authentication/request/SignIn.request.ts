import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class SignInRequest {
    @ApiProperty({
        example: "Pa55w0rd",
    })
    @IsString()
    @MaxLength(128)
    password: string;
}
