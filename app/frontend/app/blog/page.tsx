import { getAppConfig } from "@sside-net/app-config";
import { RecentBlogEntries } from "./RecentBlogEntries";

export default async function BlogRootPage() {
    return (
        <div className="blog-root-page w-blog-entry">
            <RecentBlogEntries
                fetchCount={
                    getAppConfig().frontend.blog.blogEntry.displayPerPage
                }
            />
        </div>
    );
}
