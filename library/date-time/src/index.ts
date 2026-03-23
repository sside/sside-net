import { DateTime } from "luxon";

export const DateFormat = {} as const;
export type DateFormat = (typeof DateFormat)[keyof typeof DateFormat];

export const TimeFormat = {} as const;
export type TimeFormat = (typeof TimeFormat)[keyof typeof TimeFormat];

export const DateTimeFormat = {
    Iso8601WithoutMilliseconds: `yyyy-MM-dd'T'HH:mm:ssZZ`,
    JapaneseHourAndMinute: "yyyy-MM-dd HH:mm",
} as const;
export type DateTimeFormat =
    (typeof DateTimeFormat)[keyof typeof DateTimeFormat];

type Format = TimeFormat | DateFormat | DateTimeFormat;

export const setJst = (dateTime: DateTime): DateTime =>
    dateTime.setZone("Asia/Tokyo").setLocale("ja-JP");

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
