import { FC } from "react";
import { BlogMetaTag } from "../../../component/blog-meta-tag/BlogMetaTag";
import { apiClient } from "../../../library/api-client/api-client";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";
import { BlogMenuSection } from "./BlogMenuSection";

export const BlogMenuMetaTags: FC<{}> = async ({}) => {
    const { data, error, response } = await apiClient.GET(
        "/public-blog-entry-meta-tag",
    );

    if (error) {
        captureApiCallError(response, BlogMenuMetaTags);
    }

    const metaTags = error ? [] : data;

    return (
        <BlogMenuSection headerLabel="Meta tags">
            <div className="blog-menu-meta-tags flex flex-wrap gap-2">
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
    );
};
