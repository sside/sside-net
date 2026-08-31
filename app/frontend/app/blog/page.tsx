import { getAppConfig } from "@sside-net/app-config";
import { NextPageSearchParameters } from "../../type/NextPageSearchParameter";
import { LatestBlogEntryPager } from "./LatestBlogEntryPager";
import { RecentBlogEntries } from "./RecentBlogEntries";

export default async function BlogRootPage(
    nextPageSearchParameters: NextPageSearchParameters,
) {
    const fetchCount = getAppConfig().frontend.blog.blogEntry.displayPerPage;
    const { pointerBlogEntrySlug } =
        await nextPageSearchParameters.searchParams;

    return (
        <div className="blog-root-page w-full gap-4">
            <RecentBlogEntries
                fetchCount={fetchCount}
                pointerBlogEntrySlug={pointerBlogEntrySlug}
            />
            <LatestBlogEntryPager
                count={fetchCount}
                pointerBlogEntrySlug={pointerBlogEntrySlug}
            />
        </div>
    );
}
