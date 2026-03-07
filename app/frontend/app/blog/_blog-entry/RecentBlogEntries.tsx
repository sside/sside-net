import { FC } from "react";
import { apiClient } from "../../../library/api-client/api-client";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";
import { BlogEntryFromPublishedBlogEntryResponse } from "./BlogEntryFromPublishedBlogEntryResponse";

export const RecentBlogEntries: FC<{ fetchCount: number }> = async ({
    fetchCount,
}) => {
    const { data, error, response } = await apiClient.GET(
        `/public-blog-entry/latest`,
        {
            params: {
                query: {
                    count: fetchCount,
                },
            },
        },
    );

    if (error) {
        captureApiCallError(response, RecentBlogEntries);

        throw error;
    }

    return (
        <div className="recent-blog-entries grid gap-8">
            {data.blogEntries.map((blogEntry) => (
                <BlogEntryFromPublishedBlogEntryResponse
                    key={blogEntry.id}
                    publishedBlogEntryResponse={blogEntry}
                />
            ))}
        </div>
    );
};
