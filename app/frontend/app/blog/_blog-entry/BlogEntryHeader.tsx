import { ComponentProps, FC } from "react";
import Link from "next/link";
import { DateTimeFormat, formatDateByJst } from "@sside-net/date-time";

const BlogEntryPublishAt: FC<{ publishAt: Date; updatedAt?: Date }> = ({
    publishAt,
    updatedAt,
}) => {
    return (
        <div className="blog-entry-publish-at flex gap-4 pl-1 font-light">
            <span>
                publish:{" "}
                {formatDateByJst(
                    publishAt,
                    DateTimeFormat.Iso8601WithoutMilliseconds,
                )}
            </span>
            {updatedAt && (
                <span>
                    update:{" "}
                    {formatDateByJst(
                        updatedAt,
                        DateTimeFormat.Iso8601WithoutMilliseconds,
                    )}
                </span>
            )}
        </div>
    );
};

const BlogEntryTitle: FC<{ title: string; slug: string }> = ({
    title,
    slug,
}) => {
    return (
        <Link href={`/blog/entry/${slug}`}>
            <h2 className="blog-entry-title border-text-body border-b text-5xl leading-16 font-light">
                {title}
            </h2>
        </Link>
    );
};

export const BlogEntryHeader: FC<
    {} & ComponentProps<typeof BlogEntryTitle> &
        ComponentProps<typeof BlogEntryPublishAt>
> = (properties) => {
    return (
        <header className="blog-entry-header">
            <BlogEntryTitle {...properties} />
            <BlogEntryPublishAt {...properties} />
        </header>
    );
};
