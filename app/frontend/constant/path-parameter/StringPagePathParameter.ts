export const StringPagePathParameter = {
    BlogEntrySlug: "blogEntrySlug",
    BlogEntryMetaTag: "blogEntryMetaTag",
} as const;
export type StringPagePathParameter =
    (typeof StringPagePathParameter)[keyof typeof StringPagePathParameter];
