import { FC } from "react";
import { Route } from "next";
import { PagingDirection } from "@sside-net/constant";
import {
    AdjacentBlogLinkDirection,
    AdjacentBlogLink,
} from "../../../../component/adjacent-blog-link/AdjacentBlogLink";
import { apiClient } from "../../../../library/api-client/api-client";

export const NextBlogEntryLink: FC<{ blogEntrySlug: string }> = async ({
    blogEntrySlug,
}) => {
    const { data } = await apiClient.GET(
        "/blog-entry/latest/adjecent/{direction}",
        {
            params: {
                path: {
                    direction: PagingDirection.Earlier,
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
