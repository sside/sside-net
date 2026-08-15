import { notFound } from "next/navigation";
import { StringPagePathParameter } from "../../../../constant/path-parameter/StringPagePathParameter";
import {
    apiClient,
    isNotFoundErrorResponse,
} from "../../../../library/api-client/api-client";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";
import { BlogEntryFromPublishedBlogEntryResponse } from "../../_blog-entry/BlogEntryFromPublishedBlogEntryResponse";
import { AdjacentBlogEntries } from "./AdjacentBlogEntries";

export default async function BlogEntryBySlugPage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { blogEntrySlug } = await getPagePathParameters(
        nextPagePathParameter,
        StringPagePathParameter.BlogEntrySlug,
    );
    const { data, response, error } = await apiClient.GET(
        `/blog-entry/slug/{slug}`,
        {
            params: {
                path: {
                    slug: blogEntrySlug,
                },
            },
        },
    );

    if (error) {
        if (isNotFoundErrorResponse(response)) {
            return notFound();
        }

        throw error;
    }

    return (
        <div className="blog-entry-by-slug-page w-blog-entry grid gap-4">
            <BlogEntryFromPublishedBlogEntryResponse
                publishedBlogEntryResponse={data}
            />
            <AdjacentBlogEntries blogEntryId={data.id} />
        </div>
    );
}
