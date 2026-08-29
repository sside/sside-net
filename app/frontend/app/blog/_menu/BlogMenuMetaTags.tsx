import { FC } from "react";
import { BlogMetaTag } from "../../../component/blog-meta-tag/BlogMetaTag";
import { apiClient } from "../../../library/api-client/api-client";
import { BlogMenuSection } from "./BlogMenuSection";

export const BlogMenuMetaTags: FC<{}> = async ({}) => {
    const { data, error } = await apiClient.GET("/blog-entry-meta-tag");

    const metaTags = error ? [] : data;

    return (
        <div className="blog-menu-meta-tags">
            <BlogMenuSection headerLabel="Meta tags">
                <div className="flex flex-wrap gap-1 py-2">
                    {metaTags.map(({ id, name, count }) => (
                        <BlogMetaTag
                            key={id}
                            name={name}
                            blogEntryCount={count}
                            variant="blogMenu"
                        />
                    ))}
                </div>
            </BlogMenuSection>
        </div>
    );
};
