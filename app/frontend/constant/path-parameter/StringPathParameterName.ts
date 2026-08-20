export const StringPathParameterName = {
    BlogEntrySlug: "blogEntrySlug",
    BlogEntryMetaTag: "blogEntryMetaTag",
} as const;
export type StringPathParameterName =
    (typeof StringPathParameterName)[keyof typeof StringPathParameterName];
