export const IntegerPagePathParameter = {
    BlogEntryId: "blogEntryId",
    Month: "month",
    Year: "year",
} as const;
export type IntegerPagePathParameter =
    (typeof IntegerPagePathParameter)[keyof typeof IntegerPagePathParameter];
