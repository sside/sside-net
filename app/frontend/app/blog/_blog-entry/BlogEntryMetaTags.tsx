import { ComponentProps, FC } from "react";
import { BlogMetaTag } from "../../../component/blog-meta-tag/BlogMetaTag";

export const BlogEntryMetaTags: FC<{
    metaTags: Omit<ComponentProps<typeof BlogMetaTag>, "variant">[];
}> = ({ metaTags }) => {
    return (
        <div className="blog-entry-meta-tags flex w-full items-center gap-4 border-t pt-4">
            <span className="font-bold">meta tags:</span>
            <div className="flex gap-2">
                {metaTags.map(({ ...props }) => (
                    <BlogMetaTag
                        key={props.name}
                        {...props}
                        variant="blogBody"
                    />
                ))}
            </div>
        </div>
    );
};
