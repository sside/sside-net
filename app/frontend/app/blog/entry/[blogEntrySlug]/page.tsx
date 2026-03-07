import { StringPagePathParameter } from "../../../../constant/path-parameter/StringPagePathParameter";
import { apiClient } from "../../../../library/api-client/api-client";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";
import { captureApiCallError } from "../../../../library/sentry/captureApiCallError";
import { BlogEntryFromPublishedBlogEntryResponse } from "../../_blog-entry/BlogEntryFromPublishedBlogEntryResponse";

export default async function BlogEntryBySlugPage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { blogEntrySlug } = await getPagePathParameters(
        nextPagePathParameter,
        StringPagePathParameter.BlogEntrySlug,
    );
    const { data, response, error } = await apiClient.GET(
        `/public-blog-entry/slug/{slug}`,
        {
            params: {
                path: {
                    slug: blogEntrySlug,
                },
            },
        },
    );

    if (error) {
        captureApiCallError(response, BlogEntryBySlugPage);
    }

    return (
        <div className="blog-entry-by-slug-page">
            <BlogEntryFromPublishedBlogEntryResponse
                publishedBlogEntryResponse={data}
            />
        </div>
    );
}
