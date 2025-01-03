import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { BlogEntryService } from "./blog-entry.service";
import { BlogEntryDraftQuery } from "./query/blog-entry-draft.query";
import { BlogEntryHistoryQuery } from "./query/blog-entry-history.query";
import { BlogEntryQuery } from "./query/blog-entry.query";

@Module({
    imports: [DatabaseModule],
    providers: [
        BlogEntryService,
        BlogEntryQuery,
        BlogEntryHistoryQuery,
        BlogEntryDraftQuery,
    ],
    exports: [BlogEntryService],
})
export class BlogEntryModule {}
