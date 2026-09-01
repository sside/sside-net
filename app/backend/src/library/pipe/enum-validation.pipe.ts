import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { validateInEnum, validateRequired } from "@sside-net/validator";

@Injectable()
export class EnumValidationPipe implements PipeTransform {
    constructor(private readonly enums: string[]) {}

    transform(value: unknown): string {
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
