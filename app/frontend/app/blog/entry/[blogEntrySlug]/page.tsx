import { notFound } from "next/navigation";
import { AdjacentBlogLinksContainer } from "../../../../component/adjacent-blog-link/AdjacentBlogLinksContainer";
import { StringPathParameterName } from "../../../../constant/path-parameter/StringPathParameterName";
import {
    apiClient,
    isNotFoundErrorResponse,
} from "../../../../library/api-client/api-client";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";
import { BlogEntryFromPublishedBlogEntryResponse } from "../../BlogEntryFromPublishedBlogEntryResponse";
import { NextBlogEntryLink } from "./NextBlogEntryLink";
import { PreviousBlogEntryLink } from "./PreviousBlogEntryLink";

export default async function BlogEntryBySlugPage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { blogEntrySlug } = await getPagePathParameters(
        nextPagePathParameter,
        StringPathParameterName.BlogEntrySlug,
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

    const { slug } = data;

    return (
        <div className="blog-entry-by-slug-page w-blog-entry grid gap-4">
            <BlogEntryFromPublishedBlogEntryResponse
                publishedBlogEntryResponse={data}
            />
            <AdjacentBlogLinksContainer
                next={<NextBlogEntryLink blogEntrySlug={slug} />}
                previous={<PreviousBlogEntryLink blogEntrySlug={slug} />}
            />
        </div>
    );
}
