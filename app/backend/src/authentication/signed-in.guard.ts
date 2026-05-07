import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CookieKey } from "@sside-net/constant";

@Injectable()
export class SignedInGuard implements CanActivate {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly jwtService: JwtService) {}

    async canActivate(executionContext: ExecutionContext): Promise<boolean> {
        const accessToken = executionContext.switchToHttp().getRequest()
            .cookies?.[CookieKey.AuthenticationJwt] as string | undefined;

        this.logger.log("認証チェックを行います。", {
            hasAccessTokenCookie: !!accessToken,
        });

        if (!accessToken) {
            throw new UnauthorizedException(
                "アクセストークンが送信されていません。",
            );
        }

        try {
            await this.jwtService.verifyAsync(accessToken);
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }
}
