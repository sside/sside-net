import { FC } from "react";
import Link from "next/link";
import { DateTimeFormat, formatDateByJst } from "@sside-net/date-time";
import { operations } from "../../../generated/backend-schema";
import { apiClient } from "../../../library/api-client/api-client";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";
import { BlogMenuSection } from "./BlogMenuSection";

const BlogRecentEntry: FC<{
    title: string;
    slug: string;
    publishAt: Date;
    updatedAt: Date;
}> = ({ title, slug, publishAt, updatedAt }) => {
    const isUpdated =
        Math.abs(publishAt.getTime() - updatedAt.getTime()) > 1000 * 60;

    return (
        <Link href={`/blog/entry/${slug}`}>
            <li>
                {title} (
                {formatDateByJst(
                    publishAt,
                    DateTimeFormat.Iso8601WithoutMilliseconds,
                )}
                {isUpdated &&
                    ` update: ${formatDateByJst(updatedAt, DateTimeFormat.Iso8601WithoutMilliseconds)}`}
                )
            </li>
        </Link>
    );
};

export const BlogMenuRecentEntries: FC<{}> = async ({}) => {
    const latestBlogEntries = await (async () => {
        try {
            return (
                await apiClient.GET(`/public-blog-entry/latest`, {
                    params: {
                        query: {
                            count: 5,
                        },
                    },
                })
            ).data!;
        } catch (e) {
            captureApiCallError(e, BlogMenuRecentEntries);

            return {
                blogEntries: [],
            } satisfies operations["PublicBlogEntryController_getLatestBlogEntries"]["responses"]["200"]["content"]["application/json"];
        }
    })();

    return (
        <BlogMenuSection headerLabel="Latest entries">
            <menu className="blog-menu-recent-entries">
                {latestBlogEntries.blogEntries.map(
                    ({ id, title, slug, updatedAt, publishAt }) => (
                        <BlogRecentEntry
                            key={id}
                            title={title}
                            slug={slug}
                            publishAt={new Date(publishAt)}
                            updatedAt={new Date(updatedAt)}
                        />
                    ),
                )}
            </menu>
        </BlogMenuSection>
    );
};
