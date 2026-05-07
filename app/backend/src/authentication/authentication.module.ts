import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { getAppConfig } from "@sside-net/app-config";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { SignInGuard } from "./sign-in.guard";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.AUTHENTICATION_JWT_TOKEN_SECRET,
            signOptions: {
                expiresIn: `${getAppConfig().backend.authentication.accessTokenExpireSecond}s`,
            },
        }),
    ],
    providers: [AuthenticationService, SignInGuard],
    controllers: [AuthenticationController],
    exports: [AuthenticationService],
})
export class AuthenticationModule {}
