import { FC } from "react";
import { Route } from "next";
import { AdjacentBlogLink } from "../../component/adjacent-blog-link/AdjacentBlogLink";
import { StringSearchParameterName } from "../../constant/search-parameter/StringSearchParameterName";

export const NextLatestBlogEntryLink: FC<{
    pointerBlogEntrySlug: string;
}> = async ({ pointerBlogEntrySlug }) => {
    return (
        <div className="next-latest-blog-entry-link">
            <AdjacentBlogLink
                href={
                    ("/blog" +
                        "?" +
                        new URLSearchParams({
                            [StringSearchParameterName.PointerBlogEntrySlug]:
                                pointerBlogEntrySlug,
                        })) as Route
                }
            >
                <span>Next</span>
            </AdjacentBlogLink>
        </div>
    );
};
