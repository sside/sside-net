import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { getAppConfig } from "@sside-net/app-config";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";

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
    providers: [AuthenticationService, JwtService],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {}
