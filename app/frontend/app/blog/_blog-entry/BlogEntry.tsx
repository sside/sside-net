import { ComponentProps, FC } from "react";
import { BlogEntryBody } from "./BlogEntryBody";
import { BlogEntryHeader } from "./BlogEntryHeader";

export const BlogEntry: FC<
    {} & ComponentProps<typeof BlogEntryHeader> &
        ComponentProps<typeof BlogEntryBody>
> = (props) => {
    return (
        <article className="blog-entry grid max-w-240 gap-4">
            <BlogEntryHeader {...props} />
            <BlogEntryBody bodyMarkdown={props.bodyMarkdown} />
        </article>
    );
};
