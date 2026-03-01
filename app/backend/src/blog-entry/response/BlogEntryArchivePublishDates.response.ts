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
            (previous, current): BlogEntryArchivePublishDatesResponse[] => {
                const { year, month } = setJst(DateTime.fromJSDate(current));

                const exist = previous.find(
                    ({ year: existYear, month: existMonth }) =>
                        year === existYear && month === existMonth,
                );
                if (!exist) {
                    return [
                        ...previous,
                        {
                            year,
                            month,
                            count: 1,
                        },
                    ];
                }

                exist.count += 1;

                return previous;
            },
            [],
        );
    }
}
