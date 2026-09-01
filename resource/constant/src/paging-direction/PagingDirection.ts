export const PagingDirection = {
    Later: "later",
    Earlier: "earlier",
} as const;
export type PagingDirection =
    (typeof PagingDirection)[keyof typeof PagingDirection];
