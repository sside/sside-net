import { FC } from "react";
import Link from "next/link";
import { getAppConfig } from "@sside-net/app-config";
import { DateTimeFormat, formatDateByJst } from "@sside-net/date-time";
import { apiClient } from "../../../library/api-client/api-client";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";
import { BlogMenuSection } from "./BlogMenuSection";

const BlogRecentEntry: FC<{
    title: string;
    slug: string;
    publishAt: Date;
    updatedAt?: Date;
}> = ({ title, slug, publishAt, updatedAt }) => {
    const isUpdated =
        updatedAt ?
            Math.abs(publishAt.getTime() - updatedAt.getTime()) > 1000 * 60
        :   false;

    return (
        <Link href={`/blog/entry/${slug}`}>
            <li>
                {title} (
                {formatDateByJst(
                    publishAt,
                    DateTimeFormat.Iso8601WithoutMilliseconds,
                )}
                {isUpdated &&
                    ` update: ${formatDateByJst(updatedAt!, DateTimeFormat.Iso8601WithoutMilliseconds)}`}
                )
            </li>
        </Link>
    );
};

export const BlogMenuRecentEntries: FC<{}> = async ({}) => {
    const { data, response, error } = await apiClient.GET(
        "/public-blog-entry/latest",
        {
            params: {
                query: {
                    count: getAppConfig().frontend.blog.menu
                        .recentBlogEntryCount,
                },
            },
        },
    );

    if (error) {
        captureApiCallError(response, BlogMenuRecentEntries);
    }
    const latestBlogEntries = error ? [] : data.blogEntries;

    return (
        <BlogMenuSection headerLabel="Latest entries">
            <menu className="blog-menu-recent-entries">
                {latestBlogEntries.map(
                    ({ id, title, slug, updatedAt, publishAt }) => (
                        <BlogRecentEntry
                            key={id}
                            title={title}
                            slug={slug}
                            publishAt={new Date(publishAt)}
                            updatedAt={
                                updatedAt ? new Date(updatedAt) : undefined
                            }
                        />
                    ),
                )}
            </menu>
        </BlogMenuSection>
    );
};
