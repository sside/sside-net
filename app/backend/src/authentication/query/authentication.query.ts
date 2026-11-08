import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service.js";
import { Authentication } from "../../generated/prisma/client.js";

@Injectable()
export class AuthenticationQuery {
    constructor(private readonly databaseService: DatabaseService) {}

    async findOneByRefreshToken(
        refreshToken: string,
    ): Promise<Authentication | null> {
        return await this.authentication().findUnique({
            where: {
                refreshToken,
            },
        });
    }

    async insert(
        refreshToken: string,
        expireAt: Date,
    ): Promise<Authentication> {
        return await this.authentication().create({
            data: {
                refreshToken,
                expireAt,
            },
        });
    }

    async delete(refreshToken: string): Promise<void> {
        await this.authentication().delete({
            where: {
                refreshToken,
            },
        });

        return;
    }

    private authentication() {
        return this.databaseService.authentication;
    }
}
