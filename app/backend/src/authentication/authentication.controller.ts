import { Body, Controller, Post } from "@nestjs/common";
import { ApiForbiddenResponse, ApiOkResponse } from "@nestjs/swagger";
import { AuthenticationService } from "./authentication.service";
import { SignInRequest } from "./request/SignIn.request";
import { TokenRefreshRequest } from "./request/TokenRefresh.request";
import { AuthenticationResponse } from "./response/Authentication.response";

@Controller("authentication")
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Post("sign-in")
    @ApiOkResponse({
        description: "認証JWTトークンを返します。",
        type: AuthenticationResponse,
    })
    @ApiForbiddenResponse()
    async postSignIn(
        @Body() { password }: SignInRequest,
    ): Promise<AuthenticationResponse> {
        return AuthenticationResponse.fromAuthentication(
            await this.authenticationService.signIn(password),
        );
    }

    @Post("refresh")
    @ApiOkResponse({
        description: "認証JWTトークンを返します。",
        type: AuthenticationResponse,
    })
    @ApiForbiddenResponse()
    async refreshAccessToken(
        @Body() { refreshToken }: TokenRefreshRequest,
    ): Promise<AuthenticationResponse> {
        return AuthenticationResponse.fromAuthentication(
            await this.authenticationService.refreshAuthenticationToken(
                refreshToken,
            ),
        );
    }
}
