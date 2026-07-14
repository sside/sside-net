import { ApiProperty } from "@nestjs/swagger";
import { AuthenticationToken } from "../authentication.service";

export class AuthenticationResponse {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    static fromAuthentication({
        accessToken,
        refreshToken,
    }: AuthenticationToken): AuthenticationResponse {
        return {
            accessToken,
            refreshToken,
        };
    }
}
