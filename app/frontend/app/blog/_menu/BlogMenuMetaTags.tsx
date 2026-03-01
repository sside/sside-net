import { FC } from "react";
import Link from "next/link";
import { apiClient } from "../../../library/api-client/api-client";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";
import { BlogMenuSection } from "./BlogMenuSection";

const MetaTag: FC<{
    name: string;
    blogEntryCount: number;
}> = ({ name, blogEntryCount }) => (
    <Link
        className="flex items-center gap-1 rounded-lg border p-1"
        href={`/blog/meta-tag/${name}`}
    >
        <span>{name}</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border p-1">
            {blogEntryCount}
        </span>
    </Link>
);

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
                    <MetaTag
                        key={id}
                        name={name}
                        blogEntryCount={count}
                    />
                ))}
            </div>
        </BlogMenuSection>
    );
};
