import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryMetaTagQuery } from "./query/blog-entry-meta-tag.query";
import { BlogEntryQuery } from "./query/blog-entry.query";

@Module({
    imports: [DatabaseModule],
    providers: [
        BlogEntryService,
        BlogEntryQuery,
        BlogEntryMetaTagService,
        BlogEntryMetaTagQuery,
    ],
    exports: [BlogEntryService],
})
export class BlogEntryModule {}
