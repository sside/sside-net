import { ComponentProps, FC } from "react";
import { VerticalDivider } from "../../component/divider/VerticalDivider";
import { BlogEntryBody } from "./BlogEntryBody";
import { BlogEntryHeader } from "./BlogEntryHeader";
import { BlogEntryMetaTags } from "./BlogEntryMetaTags";

export const BlogEntry: FC<
    {} & ComponentProps<typeof BlogEntryHeader> &
        ComponentProps<typeof BlogEntryBody> &
        ComponentProps<typeof BlogEntryMetaTags>
> = (props) => {
    return (
        <article className="blog-entry grid gap-4">
            <BlogEntryHeader {...props} />
            <BlogEntryBody bodyMarkdown={props.bodyMarkdown} />
            <VerticalDivider />
            <BlogEntryMetaTags metaTags={props.metaTags} />
        </article>
    );
};
