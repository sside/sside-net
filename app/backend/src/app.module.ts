import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { getAppConfig } from "@sside-net/app-config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./authentication/authentication.module";
import { BlogEntryModule } from "./blog-entry/blog-entry.module";
import { DatabaseModule } from "./database/database.module";

@Module({
    imports: [
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
