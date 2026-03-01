import { FC } from "react";
import { operations } from "../../../generated/backend-schema";
import { BlogEntry } from "./BlogEntry";

type BlogEntryResponse =
    operations["PublicBlogEntryController_getBlogEntryBySlug"]["responses"]["200"]["content"]["application/json"];

export const BlogEntryFromBlogEntryResponse: FC<{
    blogEntryResponse: BlogEntryResponse;
}> = ({
    blogEntryResponse: { title, slug, publishAt, updatedAt, bodyMarkdown },
}) => {
    return (
        <BlogEntry
            title={title}
            slug={slug}
            publishAt={new Date(publishAt)}
            updatedAt={updatedAt ? new Date(updatedAt) : undefined}
            bodyMarkdown={bodyMarkdown}
        />
    );
};
