import { FC } from "react";
import { components } from "../../generated/api-client/backend-schema";
import { BlogEntryFromPublishedBlogEntryResponse } from "./BlogEntryFromPublishedBlogEntryResponse";

export const BlogEntriesFromPublishedBlogEntryResponses: FC<{
    publishedBlogEntryResponses: components["schemas"]["PublishedBlogEntryResponse"][];
}> = ({ publishedBlogEntryResponses }) => {
    return (
        <div className="blog-entries-from-published-blog-entry-responses grid w-full gap-8">
            {publishedBlogEntryResponses.map((blogEntry) => (
                <BlogEntryFromPublishedBlogEntryResponse
                    key={blogEntry.id}
                    publishedBlogEntryResponse={blogEntry}
                />
            ))}
        </div>
    );
};
