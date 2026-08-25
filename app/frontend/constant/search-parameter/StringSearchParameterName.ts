export const StringSearchParameterName = {
    PointerBlogEntrySlug: "pointerBlogEntrySlug",
} as const;
export type StringSearchParameterName =
    (typeof StringSearchParameterName)[keyof typeof StringSearchParameterName];
