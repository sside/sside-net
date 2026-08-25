import { FC } from "react";
import { components } from "../../generated/api-client/backend-schema";
import { BlogEntryFromPublishedBlogEntryResponse } from "./BlogEntryFromPublishedBlogEntryResponse";

export const BlogEntries: FC<{
    publishedBlogEntryResponses: components["schemas"]["PublishedBlogEntryResponse"][];
}> = ({ publishedBlogEntryResponses }) => {
    return (
        <div className="blog-entries w-blog-entry grid gap-8">
            {publishedBlogEntryResponses.map((blogEntry) => (
                <BlogEntryFromPublishedBlogEntryResponse
                    publishedBlogEntryResponse={blogEntry}
                />
            ))}
        </div>
    );
};
