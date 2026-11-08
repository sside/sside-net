import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { SentryModule } from "@sentry/nestjs/setup";
import { getAppConfig } from "@sside-net/app-config";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { AuthenticationModule } from "./authentication/authentication.module.js";
import { BlogEntryModule } from "./blog-entry/blog-entry.module.js";
import { DatabaseModule } from "./database/database.module.js";

@Module({
    imports: [
        SentryModule.forRoot(),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl:
                        getAppConfig().backend.rateLimit.timeToLiveSecond *
                        1000,
                    limit: getAppConfig().backend.rateLimit.requestCount,
                },
            ],
        }),
        DatabaseModule,
        BlogEntryModule,
        AuthenticationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
