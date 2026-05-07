import { beforeEach, describe, expect, test } from "@jest/globals";
import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { getAppConfig } from "@sside-net/app-config";
import { isJWT } from "class-validator";
import { AuthenticationService } from "./authentication.service";

describe("AuthenticationService", () => {
    let authenticationService: AuthenticationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.AUTHENTICATION_JWT_TOKEN_SECRET,
                    signOptions: {
                        expiresIn: `${getAppConfig().backend.authentication.accessTokenExpireSecond}s`,
                    },
                }),
            ],
            providers: [AuthenticationService],
        }).compile();

        authenticationService = module.get<AuthenticationService>(
            AuthenticationService,
        );
    });

    describe("login", () => {
        test("環境変数ADMINISTRATOR_PASSWORDのパスワードが入力された場合、JWTのアクセストークンを返すこと。", async () => {
            const accessToken = await authenticationService.signIn(
                process.env.ADMINISTRATOR_PASSWORD!,
            );

            expect(isJWT(accessToken)).toBe(true);
        });

        test("誤ったパスワードが入力された場合、ForbiddenExceptionを投げること。", async () => {
            await expect(
                (async () => {
                    await authenticationService.signIn("not_valid_password");
                })(),
            ).rejects.toThrow();
        });
    });
});
