import { FC } from "react";
import { NextBlogEntryLink } from "./NextBlogEntryLink";
import { PreviousBlogEntryLink } from "./PreviousBlogEntryLink";

export const AdjacentBlogEntries: FC<{ blogEntryId: number }> = ({
    blogEntryId,
}) => {
    return (
        <div className="adjacent-blog-entries flex w-full justify-between">
            <PreviousBlogEntryLink blogEntryId={blogEntryId} />
            <div className="ml-auto">
                <NextBlogEntryLink blogEntryId={blogEntryId} />
            </div>
        </div>
    );
};
