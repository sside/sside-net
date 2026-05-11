import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { parseDecimalInt } from "@sside-net/utility";

@Injectable()
export class YearValidationPipe implements PipeTransform {
    transform(value: unknown) {
        if (typeof value !== "string" && typeof value !== "number") {
            throw new BadRequestException("数値を入力してください。");
        }

        const parsed = parseDecimalInt(value);
        if (!parsed || parsed < 2020 || parsed > 2100) {
            throw new BadRequestException(
                "年度は2020 - 2100の間で入力してください。",
            );
        }

        return parsed;
    }
}
