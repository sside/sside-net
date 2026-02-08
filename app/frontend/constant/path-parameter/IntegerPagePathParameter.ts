export const IntegerPagePathParameter = {
    Month: "month",
    Year: "year",
} as const;
export type IntegerPagePathParameter =
    (typeof IntegerPagePathParameter)[keyof typeof IntegerPagePathParameter];
