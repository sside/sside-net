import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RequestHeaderName } from "@sside-net/constant";
import { Request } from "express";

@Injectable()
export class SignedInGuard implements CanActivate {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly jwtService: JwtService) {}

    async canActivate(executionContext: ExecutionContext): Promise<boolean> {
        const accessToken = executionContext
            .switchToHttp()
            .getRequest<Request>().headers[RequestHeaderName.Authentication];

        this.logger.log("認証チェックを行います。", {
            hasAccessToken: !!accessToken,
        });

        if (typeof accessToken !== "string") {
            throw new UnauthorizedException(
                "アクセストークンが送信されていません。",
            );
        }

        try {
            await this.jwtService.verifyAsync(accessToken, {
                secret: process.env.AUTHENTICATION_JWT_TOKEN_SECRET,
            });
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
