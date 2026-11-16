import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { validateInEnum, validateRequired } from "@sside-net/validator";

@Injectable()
export class EnumValidationPipe implements PipeTransform<string> {
    constructor(private readonly enums: string[]) {}

    transform(value: unknown): string {
        if (typeof value !== "string") {
            throw new BadRequestException(
                `enum内の値は文字列を送信してください。`,
            );
        }
        const requiredValidationResult = validateRequired(value);
        if (requiredValidationResult !== true) {
            throw new BadRequestException(requiredValidationResult);
        }

        const enumValidationResult = validateInEnum(value, this.enums);
        if (enumValidationResult !== true) {
            throw new BadRequestException(enumValidationResult);
        }

        return value as string;
    }
}
