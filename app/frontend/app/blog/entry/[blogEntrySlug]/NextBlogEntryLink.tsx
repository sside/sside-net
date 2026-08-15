import { FC } from "react";
import { Route } from "next";
import {
    AdjacentBlogLinkDirection,
    AdjacentBlogLink,
} from "../../../../component/adjacent-blog-link/AdjacentBlogLink";
import { apiClient } from "../../../../library/api-client/api-client";

export const NextBlogEntryLink: FC<{ blogEntryId: number }> = async ({
    blogEntryId,
}) => {
    const { data } = await apiClient.GET("/blog-entry/earlier", {
        params: {
            query: {
                "pointer-blog-entry-id": blogEntryId,
            },
        },
    });

    if (!data) {
        return null;
    }

    const { slug, title } = data;

    return (
        <div className="next-blog-entry-link">
            <AdjacentBlogLink
                href={`/blog/entry/${slug}` as Route}
                direction={AdjacentBlogLinkDirection.Next}
            >
                <span className="text-lg">{title}</span>
            </AdjacentBlogLink>
        </div>
    );
};
