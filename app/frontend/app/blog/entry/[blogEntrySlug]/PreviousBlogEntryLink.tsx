import { FC } from "react";
import { Route } from "next";
import { PagingDirection } from "@sside-net/constant";
import {
    AdjacentBlogLinkDirection,
    AdjacentBlogLink,
} from "../../../../component/adjacent-blog-link/AdjacentBlogLink";
import { apiClient } from "../../../../library/api-client/api-client";

export const PreviousBlogEntryLink: FC<{ blogEntrySlug: string }> = async ({
    blogEntrySlug,
}) => {
    const { data } = await apiClient.GET(
        "/blog-entry/latest/adjecent/{direction}",
        {
            params: {
                path: {
                    direction: PagingDirection.Later,
                },
                query: {
                    "pointer-blog-entry-slug": blogEntrySlug,
                    count: 1,
                },
            },
        },
    );

    if (!data) {
        return null;
    }

    const { slug, title } = data;

    return (
        <div className="previous-blog-entry-link">
            <AdjacentBlogLink
                href={`/blog/entry/${slug}` as Route}
                direction={AdjacentBlogLinkDirection.Previous}
            >
                <span className="text-lg">{title}</span>
            </AdjacentBlogLink>
        </div>
    );
};
