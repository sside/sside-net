import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInRequest {
    @ApiProperty()
    @IsString()
    password: string;
}
