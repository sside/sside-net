import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import * as process from "node:process";
import { LoggerService } from "../logger/logger.service";

type PrismaTransactionOption =
    | { isolationLevel?: Prisma.TransactionIsolationLevel }
    | {
          maxWait?: number;
          timeout?: number;
          isolationLevel?: Prisma.TransactionIsolationLevel;
      };

@Injectable()
export class DatabaseService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor(private readonly loggerService: LoggerService) {
        super();
        this.loggerService.setContext(this.constructor.name);
    }

    async onModuleInit() {
        console.log(process.env.DATABASE_URL);
        this.loggerService.debug("接続情報", {
            DATABASE_URL: process.env.DATABASE_URL,
        });
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async transaction<T>(
        callback: (prismaClient: Prisma.TransactionClient) => Promise<T>,
        ongoingTransaction?: Prisma.TransactionClient,
        transactionOption?: PrismaTransactionOption,
    ): Promise<T> {
        if (ongoingTransaction) {
            return await callback(ongoingTransaction);
        }

        return this.$transaction(async (transaction) => {
            this.loggerService.log("DBトランザクションを開始します。", {
                name: callback.name ?? "No name",
                ...transactionOption,
            });

            try {
                return await callback(transaction);
            } catch (e) {
                this.loggerService.warn(
                    "トランザクション中にエラー発生。ROLLBACKします。",
                    {
                        name: callback.name ?? "No name",
                        ...transactionOption,
                    },
                );

                throw e;
            }
        }, transactionOption);
    }
}
