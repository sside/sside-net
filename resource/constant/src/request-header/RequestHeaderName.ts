export const RequestHeaderName = {
    Authentication: "authentication",
} as const;
export type RequestHeaderName =
    (typeof RequestHeaderName)[keyof typeof RequestHeaderName];
