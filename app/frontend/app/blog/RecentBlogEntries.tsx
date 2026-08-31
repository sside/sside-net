import { FC } from "react";
import { apiClient } from "../../library/api-client/api-client";
import { captureApiCallError } from "../../library/sentry/captureApiCallError";
import { BlogEntriesFromPublishedBlogEntryResponses } from "./BlogEntriesFromPublishedBlogEntryResponses";

export const RecentBlogEntries: FC<{
    fetchCount: number;
    pointerBlogEntrySlug: string | undefined;
}> = async ({ fetchCount, pointerBlogEntrySlug }) => {
    const { data, error, response } = await apiClient.GET(
        `/blog-entry/latest`,
        {
            params: {
                query: {
                    count: fetchCount,
                    "pointer-blog-entry-slug": pointerBlogEntrySlug,
                },
            },
        },
    );

    if (error) {
        await captureApiCallError(response, RecentBlogEntries);

        throw error;
    }

    return (
        <div className="recent-blog-entries">
            <BlogEntriesFromPublishedBlogEntryResponses
                publishedBlogEntryResponses={data}
            />
        </div>
    );
};
