import {
    ForbiddenException,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { getAppConfig } from "@sside-net/app-config";
import { DateTime } from "luxon";
import { randomBytes } from "node:crypto";
import { Authentication } from "../generated/prisma/client";
import { AuthenticationQuery } from "./query/authentication.query";

export type AuthenticationToken = {
    accessToken: string;
    refreshToken: string;
};

type AccessToken = {};

@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly authenticationQuery: AuthenticationQuery,
    ) {}

    async signIn(rawPassword: string): Promise<AuthenticationToken> {
        this.logger.log("ログイン試行を行います。");

        if (process.env.ADMINISTRATOR_PASSWORD !== rawPassword) {
            throw new ForbiddenException("パスワードが違います。");
        }

        const { refreshToken } = await this.createRefreshToken();

        return {
            accessToken: await this.createAccessToken({}),
            refreshToken,
        };
    }

    async refreshAuthenticationToken(
        refreshToken: string,
    ): Promise<AuthenticationToken> {
        this.logger.log("ログイントークンのリフレッシュを行います。", {
            // リフレッシュトークンは削除するのでログに残しても問題ない。
            refreshToken,
        });

        const existRefreshToken =
            await this.authenticationQuery.findOneByRefreshToken(refreshToken);
        if (!existRefreshToken || existRefreshToken.expireAt < new Date()) {
            throw new UnauthorizedException();
        }

        const [accessToken, authentication] = await Promise.all([
            this.createAccessToken({}),
            this.createRefreshToken(),
            this.authenticationQuery.delete(refreshToken),
        ]);

        return {
            accessToken,
            refreshToken: authentication.refreshToken,
        };
    }

    private async createAccessToken(payload: AccessToken): Promise<string> {
        this.logger.log("アクセストークンを作成します。", {
            payload,
        });

        return await this.jwtService.signAsync(payload, {
            // JwtModuleのimport時にシークレットは指定しているが効いていないのでここでも渡している。
            secret: process.env.AUTHENTICATION_JWT_TOKEN_SECRET,
            expiresIn: `${getAppConfig().global.authentication.accessTokenExpireSecond}s`,
        });
    }

    private async createRefreshToken(): Promise<Authentication> {
        const REFRESH_TOKEN_LENGTH = 64;

        return await this.authenticationQuery.insert(
            randomBytes(REFRESH_TOKEN_LENGTH)
                .toString("base64url")
                .slice(0, REFRESH_TOKEN_LENGTH),
            DateTime.now()
                .plus({
                    second: getAppConfig().global.authentication
                        .refreshTokenExpireSecond,
                })
                .toJSDate(),
        );
    }
}
