import { DateTime, DateTimeOptions } from "luxon";

export const DateFormat = {} as const;
export type DateFormat = (typeof DateFormat)[keyof typeof DateFormat];

export const TimeFormat = {} as const;
export type TimeFormat = (typeof TimeFormat)[keyof typeof TimeFormat];

export const DateTimeFormat = {
    Iso8601WithoutMilliseconds: `yyyy-MM-dd'T'HH:mm:ssZZ`,
    JapaneseHourAndMinute: "yyyy-MM-dd HH:mm",
    DateTimeLocal: "yyyy-MM-dd'T'HH:mm",
} as const;
export type DateTimeFormat =
    (typeof DateTimeFormat)[keyof typeof DateTimeFormat];

type Format = TimeFormat | DateFormat | DateTimeFormat;

export const LUXON_JST_OPTION = {
    zone: "Asia/Tokyo",
    locale: "ja-JP",
} satisfies Pick<DateTimeOptions, "zone" | "locale">;

export const setJst = (dateTime: DateTime): DateTime =>
    dateTime.setZone(LUXON_JST_OPTION.zone).setLocale(LUXON_JST_OPTION.locale);

export const parseIso8601ToJst = (iso8601DateTime: string): DateTime => {
    const parsed = DateTime.fromISO(iso8601DateTime);
    if (!parsed.isValid) {
        throw new Error(
            `ISO8601でない値が入力されています。input:${iso8601DateTime}`,
        );
    }

    return setJst(parsed);
};

export const formatDateByJst = (date: Date, format: Format): string =>
    setJst(DateTime.fromJSDate(date)).toFormat(format);

export const createJstYearRange = (year: number): [Date, Date] => {
    const startOfYear = DateTime.fromObject(
        { year, day: 1 },
        LUXON_JST_OPTION,
    ).startOf("year");

    return [
        startOfYear.toJSDate(),
        startOfYear
            .plus({
                year: 1,
            })
            .toJSDate(),
    ];
};

export const createJstMonthRange = (
    year: number,
    month: number,
): [Date, Date] => {
    const startOfMonth = DateTime.fromObject(
        {
            year,
            month,
            day: 1,
        },
        LUXON_JST_OPTION,
    ).startOf("month");

    return [
        startOfMonth.toJSDate(),
        startOfMonth
            .plus({
                month: 1,
            })
            .toJSDate(),
    ];
};
