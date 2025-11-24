import { ApiProperty } from "@nestjs/swagger";

export class BaseIdentifiableResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    static fromEntity({
        id,
        createdAt,
        updatedAt,
    }: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }): BaseIdentifiableResponse {
        return {
            id,
            createdAt,
            updatedAt,
        };
    }
}
