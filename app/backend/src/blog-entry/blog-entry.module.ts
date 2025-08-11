import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service";
import { BlogEntryController } from "./blog-entry.controller";
import { BlogEntryService } from "./blog-entry.service";
import { PublicBlogEntryController } from "./public-blog-entry.controller";
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
    controllers: [BlogEntryController, PublicBlogEntryController],
})
export class BlogEntryModule {}
