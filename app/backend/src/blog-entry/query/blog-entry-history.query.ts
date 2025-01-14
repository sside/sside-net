import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "../../database/database.service";

@Injectable()
export class BlogEntryHistoryQuery {
    constructor(private databaseService: DatabaseService) {}

    private blogEntryHistory(transaction?: Prisma.TransactionClient) {
        return (transaction ?? this.databaseService).blogEntryHistory;
    }
}
