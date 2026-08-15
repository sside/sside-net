import { FC } from "react";
import { apiClient } from "../../../../library/api-client/api-client";
import {
    AdjacentBlogEntryDirection,
    AdjacentBlogEntryLink,
} from "./AdjacentBlogEntryLink";

export const PreviousBlogEntryLink: FC<{ blogEntryId: number }> = async ({
    blogEntryId,
}) => {
    const { data } = await apiClient.GET("/blog-entry/later", {
        params: {
            query: {
                "pointer-blog-entry-id": blogEntryId,
            },
        },
    });

    if (!data) {
        return null;
    }

    const { slug, title, publishAt, updatedAt } = data;

    return (
        <div className="next-blog-entry-link">
            <AdjacentBlogEntryLink
                direction={AdjacentBlogEntryDirection.Previous}
                slug={slug}
                title={title}
                publishedAt={new Date(publishAt)}
                updatedAt={updatedAt ? new Date(updatedAt) : undefined}
            />
        </div>
    );
};
