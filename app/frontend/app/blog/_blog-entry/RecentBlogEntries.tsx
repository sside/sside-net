import { FC } from "react";
import { notFound } from "next/navigation";
import {
    apiClient,
    isNotFoundErrorResponse,
} from "../../../library/api-client/api-client";
import { BlogEntryFromPublishedBlogEntryResponse } from "./BlogEntryFromPublishedBlogEntryResponse";

export const RecentBlogEntries: FC<{ fetchCount: number }> = async ({
    fetchCount,
}) => {
    const { data, error, response } = await apiClient.GET(
        `/blog-entry/latest`,
        {
            params: {
                query: {
                    count: fetchCount,
                },
            },
        },
    );

    if (error) {
        if (isNotFoundErrorResponse(response)) {
            return notFound();
        }

        throw error;
    }

    return (
        <div className="recent-blog-entries grid gap-8">
            {data.map((blogEntry) => (
                <BlogEntryFromPublishedBlogEntryResponse
                    key={blogEntry.id}
                    publishedBlogEntryResponse={blogEntry}
                />
            ))}
        </div>
    );
};
