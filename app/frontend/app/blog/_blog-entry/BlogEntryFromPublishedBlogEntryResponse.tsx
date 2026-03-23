import { FC } from "react";
import { components } from "../../../library/api-client/backend-schema";
import { BlogEntry } from "./BlogEntry";

type PublishedBlogEntryResponse =
    components["schemas"]["PublishedBlogEntryResponse"];

export const BlogEntryFromPublishedBlogEntryResponse: FC<{
    publishedBlogEntryResponse: PublishedBlogEntryResponse;
}> = ({
    publishedBlogEntryResponse: {
        title,
        slug,
        publishAt,
        updatedAt,
        bodyMarkdown,
        metaTags,
    },
}) => {
    return (
        <BlogEntry
            title={title}
            slug={slug}
            publishAt={new Date(publishAt)}
            updatedAt={updatedAt ? new Date(updatedAt) : undefined}
            bodyMarkdown={bodyMarkdown}
            metaTags={metaTags.map(({ id, name, count }) => ({
                id,
                name,
                blogEntryCount: count,
            }))}
        />
    );
};
