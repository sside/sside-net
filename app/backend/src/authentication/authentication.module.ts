import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module.js";
import { AuthenticationController } from "./authentication.controller.js";
import { AuthenticationService } from "./authentication.service.js";
import { AuthenticationQuery } from "./query/authentication.query.js";

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
