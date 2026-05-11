import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { parseDecimalInt } from "@sside-net/utility";

@Injectable()
export class MonthValidationPipe implements PipeTransform {
    transform(value: unknown) {
        if (typeof value !== "string" && typeof value !== "number") {
            throw new BadRequestException("数値を入力してください。");
        }

        const parsed = parseDecimalInt(value);
        if (!parsed || !(1 <= parsed && parsed <= 12)) {
            throw new BadRequestException("月は1 - 12の間で入力してください。");
        }

        return parsed;
    }
}
