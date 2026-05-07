import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly jwtService: JwtService) {}

    async signIn(rawPassword: string): Promise<string> {
        this.logger.log("ログイン試行を行います。");

        if (process.env.ADMINISTRATOR_PASSWORD !== rawPassword) {
            throw new ForbiddenException("パスワードが違います。");
        }

        return await this.jwtService.signAsync({});
    }
}
