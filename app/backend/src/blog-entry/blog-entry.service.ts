import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import {
    BlogEntryQuery,
    BlogEntryWithRelations,
} from "./query/blog-entry.query";
import { BlogEntry } from "@prisma/client";
import { BlogEntryRequireData } from "./type/BlogEntryRequireData";

@Injectable()
export class BlogEntryService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly blogEntryQuery: BlogEntryQuery) {}

    async findOneById(blogEntryId: string): Promise<BlogEntryWithRelations> {
        this.logger.log("idでBlogEntryを取得します。", {
            blogEntryId,
        });

        const blogEntry = await this.blogEntryQuery.findOneById(blogEntryId);

        if (!blogEntry) {
            throw new NotFoundException(
                `BlogEntryが見つかりませんでした。blogEntryId: ${blogEntryId}`,
            );
        }

        return blogEntry;
    }

    async createOneDraft(
        blogEntryRequireData: BlogEntryRequireData,
    ): Promise<BlogEntry> {
        const { title, slug, metaTagIds } = blogEntryRequireData;
        this.logger.log("BlogEntryのDraftを作成します。", {
            title,
            slug,
            metaTagIds,
        });

        return this.blogEntryQuery.createOneDraft(blogEntryRequireData);
    }
}
