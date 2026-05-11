import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { parseDecimalInt } from "@sside-net/utility";

@Injectable()
export class NumberLimitationPipe implements PipeTransform {
    constructor(private readonly maximum: number) {}

    transform(value: unknown) {
        if (typeof value !== "string" && typeof value !== "number") {
            throw new BadRequestException("数値を入力してください。");
        }

        const parsed = parseDecimalInt(value);
        if (!parsed) {
            throw new BadRequestException("数値を入力してください。");
        }

        if (parsed > this.maximum) {
            throw new BadRequestException(
                `${this.maximum}未満の整数を入力してください。`,
            );
        }

        return parsed;
    }
}
