import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

// Prisma.$transactionの引数にinterfaceの定義がないためコピペ
interface PrismaTransactionOption {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
}

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(this.constructor.name);

    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    async transaction<T>(
        callback: (prismaClient: Prisma.TransactionClient) => Promise<T>,
        ongoingTransaction?: Prisma.TransactionClient,
        prismaTransactionOption?: PrismaTransactionOption,
    ): Promise<T> {
        if (ongoingTransaction) {
            return callback(ongoingTransaction);
        }

        return this.$transaction(async (transaction) => {
            this.logger.log("DBトランザクションを開始します。", {
                name: callback.name ?? "No name",
                ...prismaTransactionOption,
            });

            try {
                return await callback(transaction);
            } catch (e) {
                this.logger.warn(
                    `トランザクション中にエラー。ROLLBACKされます。`,
                    {
                        name: callback.name ?? "No name",
                        ...prismaTransactionOption,
                    },
                );

                throw e;
            }
        }, prismaTransactionOption);
    }
}
