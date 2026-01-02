import { DateTime } from "luxon";

export const setJst = (dateTime: DateTime): DateTime =>
    dateTime.setZone("Asia/Tokyo").setLocale("ja-JP");
