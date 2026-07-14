import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationQuery } from "./query/authentication.query";

@Module({
    imports: [
        DatabaseModule,
        JwtModule.register({
            global: true,
        }),
    ],
    providers: [AuthenticationService, JwtService, AuthenticationQuery],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {}
