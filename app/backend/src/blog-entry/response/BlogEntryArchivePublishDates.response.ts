import { ApiProperty } from "@nestjs/swagger";
import { setJst } from "@sside-net/date-time";
import { DateTime } from "luxon";

export class BlogEntryArchivePublishDatesResponse {
    @ApiProperty()
    year: number;

    @ApiProperty()
    month: number;

    @ApiProperty()
    count: number;

    static countFromDates(
        dates: Date[],
    ): BlogEntryArchivePublishDatesResponse[] {
        return dates.reduce(
            (prev, curr): BlogEntryArchivePublishDatesResponse[] => {
                const { year, month } = setJst(DateTime.fromJSDate(curr));

                const exist = prev.find(
                    ({ year: existYear, month: existMonth }) =>
                        year === existYear && month === existMonth,
                );
                if (!exist) {
                    return [
                        ...prev,
                        {
                            year,
                            month,
                            count: 1,
                        },
                    ];
                }

                exist.count += 1;

                return prev;
            },
            [],
        );
    }
}
