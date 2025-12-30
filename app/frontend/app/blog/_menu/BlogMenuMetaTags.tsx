import { FC } from "react";
import Link from "next/link";
import { ProjectLogger } from "@sside-net/project-logger";
import { notImplementedStab } from "@sside-net/utility";
import { apiClient } from "../../../library/api-client/api-client";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";
import { BlogMenuSection } from "./BlogMenuSection";

const MetaTag: FC<{
    name: string;
    blogEntryCount: number;
}> = ({ name, blogEntryCount }) => (
    <Link
        className="flex items-center gap-1 rounded-lg border p-1"
        //TODO: /blob/metaTag/:metaTagId追加したら対応
        href={notImplementedStab("/")}
    >
        <span>{name}</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border p-1">
            {blogEntryCount}
        </span>
    </Link>
);

export const BlogMenuMetaTags: FC<{}> = async ({}) => {
    const metaTags = await (async () => {
        try {
            return (await apiClient.GET("/public-blog-entry-meta-tag")).data!;
        } catch (e) {
            captureApiCallError(e, BlogMenuMetaTags);

            return [];
        }
    })();

    const logger = new ProjectLogger("BlogMenuMetaTags");
    logger.debug("meta tags", { metaTags });

    return (
        <BlogMenuSection headerLabel="Meta tags">
            <div className="flex flex-wrap gap-2">
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
