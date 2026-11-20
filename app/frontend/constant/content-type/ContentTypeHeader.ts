export type ContentTypeHeader = { "Content-Type": string };

export const ContentTypeHeaders = {
    JsonFeed: {
        "Content-Type": "application/feed+json; charset=UTF-8",
    },
    Atom: {
        "Content-Type": "application/atom+xml; charset=UTF-8",
    },
    Rss: {
        "Content-Type": "application/rss+xml; charset=UTF-8",
    },
} satisfies Record<string, ContentTypeHeader>;
