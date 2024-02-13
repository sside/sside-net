import { Module } from "@nestjs/common";
import { BlogEntryService } from "./blog-entry.service";
import { DatabaseModule } from "../database/database.module";
import { BlogEntryQuery } from "./query/blog-entry.query";

@Module({
    imports: [DatabaseModule],
    providers: [BlogEntryService, BlogEntryQuery],
})
export class BlogEntryModule {}
