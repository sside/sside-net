import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BlogEntryModule } from "./blog-entry/blog-entry.module";
import { DatabaseModule } from "./database/database.module";

@Module({
    imports: [BlogEntryModule, DatabaseModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
