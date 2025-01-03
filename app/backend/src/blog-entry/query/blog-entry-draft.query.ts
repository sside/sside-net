import { Injectable } from "@nestjs/common";
import { BlogEntryDraft, Prisma } from "@prisma/client";
import { DatabaseService } from "../../database/database.service";

@Injectable()
export class BlogEntryDraftQuery {
    constructor(private readonly databaseService: DatabaseService) {}

    async upsert(
        blogEntryId: number,
        blogEntryDraft: Omit<Prisma.BlogEntryDraftCreateInput, "blogEntry">,
        transaction?: Prisma.TransactionClient,
    ): Promise<BlogEntryDraft> {
        return await this.blogEntryDraft(transaction).upsert({
            where: {
                blogEntryId,
            },
            create: {
                ...blogEntryDraft,
                blogEntry: {
                    connect: {
                        id: blogEntryId,
                    },
                },
            },
            update: {
                ...blogEntryDraft,
            },
        });
    }

    async deleteByBlogEntryId(
        blogEntryId: number,
        transaction?: Prisma.TransactionClient,
    ): Promise<void> {
        await this.blogEntryDraft(transaction).delete({
            where: {
                blogEntryId,
            },
        });

        return;
    }

    private blogEntryDraft(transaction?: Prisma.TransactionClient) {
        return (transaction ?? this.databaseService).blogEntryDraft;
    }
}
