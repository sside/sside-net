import { beforeEach, describe, expect, test } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { isJWT } from "class-validator";
import { AuthenticationModule } from "./authentication.module";
import { AuthenticationService } from "./authentication.service";

describe("AuthenticationService", () => {
    let authenticationService: AuthenticationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AuthenticationModule],
        }).compile();

        authenticationService = module.get<AuthenticationService>(
            AuthenticationService,
        );
    });

    describe("login", () => {
        test("環境変数ADMINISTRATOR_PASSWORDのパスワードが入力された場合、JWTのアクセストークンを返すこと。", async () => {
            const { accessToken } = await authenticationService.signIn(
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
