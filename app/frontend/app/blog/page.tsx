import { getAppConfig } from "@sside-net/app-config";
import { RecentBlogEntries } from "./_blog-entry/RecentBlogEntries";

export default async function BlogRootPage() {
    return (
        <>
            <RecentBlogEntries
                fetchCount={
                    getAppConfig().frontend.blog.blogEntry.displayPerPage
                }
            />
        </>
    );
}
