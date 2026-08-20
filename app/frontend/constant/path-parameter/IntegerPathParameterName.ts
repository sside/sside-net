export const IntegerPathParameterName = {
    BlogEntryId: "blogEntryId",
    Month: "month",
    Year: "year",
} as const;
export type IntegerPathParameterName =
    (typeof IntegerPathParameterName)[keyof typeof IntegerPathParameterName];
