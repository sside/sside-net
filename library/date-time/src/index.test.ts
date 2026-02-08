import { describe, expect, test } from "@jest/globals";
import { DateTime } from "luxon";
import { DateTimeFormat, formatDateByJst, setJst } from "./index";

describe("date-time", () => {
    describe("setJst", () => {
        test("タイムゾーンがセットできていること。", () => {
            const jst = setJst(
                DateTime.fromJSDate(new Date("2025-12-31T20:00:00Z")),
            );

            expect(jst.zone.name).toBe("Asia/Tokyo");
            expect(jst.offset).toBe(540);
            expect(jst.year).toBe(2026);
            expect(jst.month).toBe(1);
        });
    });
    describe("formatDateByJst", () => {
        test("JSTのタイムゾーンでフォーマットに則った文字列が返ること。", () => {
            const date = new Date("2026-02-10T12:00:00Z");
            expect(
                formatDateByJst(
                    date,
                    DateTimeFormat.Iso8601WithoutMilliseconds,
                ),
            ).toBe("2026-02-10T21:00:00+09:00");
        });
    });
});
