import { ApiProperty } from "@nestjs/swagger";

export class BaseIdentifiableItemResponse {
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
    }): BaseIdentifiableItemResponse {
        return {
            id,
            createdAt,
            updatedAt,
        };
    }
}
