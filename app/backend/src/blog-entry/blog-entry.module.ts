import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module.js";
import { DatabaseModule } from "../database/database.module.js";
import { BlogEntryMetaTagController } from "./blog-entry-meta-tag.controller.js";
import { BlogEntryMetaTagService } from "./blog-entry-meta-tag.service.js";
import { BlogEntryController } from "./blog-entry.controller.js";
import { BlogEntryService } from "./blog-entry.service.js";
import { PublicBlogEntryMetaTagController } from "./public-blog-entry-meta-tag.controller.js";
import { PublicBlogEntryController } from "./public-blog-entry.controller.js";
import { PublicBlogEntryService } from "./public-blog-entry.service.js";
import { BlogEntryMetaTagQuery } from "./query/blog-entry-meta-tag.query.js";
import { BlogEntryQuery } from "./query/blog-entry.query.js";

@Module({
    imports: [DatabaseModule, AuthenticationModule],
    providers: [
        BlogEntryService,
        BlogEntryQuery,
        BlogEntryMetaTagService,
        BlogEntryMetaTagQuery,
        PublicBlogEntryService,
    ],
    exports: [BlogEntryService],
    controllers: [
        BlogEntryController,
        PublicBlogEntryController,
        BlogEntryMetaTagController,
        PublicBlogEntryMetaTagController,
    ],
})
export class BlogEntryModule {}
