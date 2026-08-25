import { FC } from "react";
import { Route } from "next";
import { AdjacentBlogLink } from "../../component/adjacent-blog-link/AdjacentBlogLink";
import { StringSearchParameterName } from "../../constant/search-parameter/StringSearchParameterName";

export const PreviousLatestBlogEntryLink: FC<{
    pointerBlogEntrySlug: string;
}> = ({ pointerBlogEntrySlug }) => {
    return (
        <div className="previous-latest-blog-entry-link">
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
                <span>Previous</span>
            </AdjacentBlogLink>
        </div>
    );
};
