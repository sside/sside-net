import { ComponentProps, FC } from "react";
import { BlogEntryBody } from "./BlogEntryBody";
import { BlogEntryHeader } from "./BlogEntryHeader";
import { BlogEntryMetaTags } from "./BlogEntryMetaTags";

export const BlogEntry: FC<
    {} & ComponentProps<typeof BlogEntryHeader> &
        ComponentProps<typeof BlogEntryBody> &
        ComponentProps<typeof BlogEntryMetaTags>
> = (props) => {
    return (
        <article className="blog-entry grid w-full max-w-240 gap-4">
            <BlogEntryHeader {...props} />
            <BlogEntryBody bodyMarkdown={props.bodyMarkdown} />
            <BlogEntryMetaTags metaTags={props.metaTags} />
        </article>
    );
};
