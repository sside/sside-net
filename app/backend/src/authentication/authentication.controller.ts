import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { CookieKey } from "@sside-net/constant";
import { Response as ExpressResponse } from "express";
import { AuthenticationService } from "./authentication.service";
import { SignInRequest } from "./request/SignInRequest";

@Controller("authentication")
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Post("sign-in")
    async postSignIn(
        @Body() { password }: SignInRequest,
        @Res() res: ExpressResponse,
    ) {
        return res
            .cookie(
                CookieKey.AuthenticationJwt,
                await this.authenticationService.signIn(password),
            )
            .status(HttpStatus.OK)
            .send();
    }
}
