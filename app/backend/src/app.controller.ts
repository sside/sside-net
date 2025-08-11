import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
} from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiOkResponse } from "@nestjs/swagger";
import { DatabaseService } from "./database/database.service";

@Controller()
export class AppController {
    constructor(private readonly databaseService: DatabaseService) {}

    @Get("health-check")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse()
    @ApiInternalServerErrorResponse()
    async getHello(): Promise<void> {
        if (!(await this.databaseService.hasConnection())) {
            throw new InternalServerErrorException(
                "DB接続が確認できませんでした。",
            );
        }

        return;
    }
}
