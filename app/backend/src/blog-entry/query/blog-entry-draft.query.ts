import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "../../database/database.service";

@Injectable()
export class BlogEntryDraftQuery {
    constructor(private readonly databaseService: DatabaseService) {}

    private blogEntryDraft(transaction?: Prisma.TransactionClient) {
        return (transaction ?? this.databaseService).blogEntryDraft;
    }
}
