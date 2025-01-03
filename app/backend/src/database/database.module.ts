import { Module } from "@nestjs/common";
import { LoggerModule } from "../logger/logger.module";
import { DatabaseService } from "./database.service";

@Module({
    imports: [LoggerModule],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
