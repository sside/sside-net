import { describe, expect, test } from "@jest/globals";
import { DateTime } from "luxon";
import { setJst } from "./index";

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
});
