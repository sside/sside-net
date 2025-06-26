import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class DatabaseService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(this.constructor.name);

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async transaction<T>(
        callback: (transactionClient: Prisma.TransactionClient) => Promise<T>,
        ongoingTransaction?: Prisma.TransactionClient,
        transactionOption?: Parameters<PrismaClient["$transaction"]>[1],
    ) {
        if (ongoingTransaction) {
            if (transactionOption) {
                this.logger.warn(
                    "進行中のDB TRANSACTIONが既にあるため、指定されたTRANSACTIONのオプションは無視されます。",
                    {
                        name: callback.name,
                        ...transactionOption,
                    },
                );
            }

            return await callback(ongoingTransaction);
        }

        return this.$transaction(async (transactionClient) => {
            try {
                this.logger.log("DB TRANSACTION開始。", {
                    name: callback.name,
                    transactionOption,
                });

                return await callback(transactionClient);
            } catch (e) {
                this.logger.error(
                    "DB TRANSACTION中にエラー。ROLLBACKを実行。",
                    e,
                );

                throw e;
            }
        }, transactionOption);
    }
}
