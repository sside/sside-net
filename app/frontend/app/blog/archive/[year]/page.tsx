import { notFound } from "next/navigation";
import { getAppConfig } from "@sside-net/app-config";
import { IntegerPathParameterName } from "../../../../constant/path-parameter/IntegerPathParameterName";
import {
    apiClient,
    isNotFoundErrorResponse,
} from "../../../../library/api-client/api-client";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";
import { BlogEntryFromPublishedBlogEntryResponse } from "../../BlogEntryFromPublishedBlogEntryResponse";

export default async function YearArchivePage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { year } = await getPagePathParameters(
        nextPagePathParameter,
        IntegerPathParameterName.Year,
    );
    const { data, error, response } = await apiClient.GET(
        "/blog-entry/archive/{year}",
        {
            params: {
                path: {
                    year,
                },
                query: {
                    count: getAppConfig().frontend.blog.blogEntry
                        .displayPerPage,
                },
            },
        },
    );

    if (error && isNotFoundErrorResponse(response)) {
        return notFound();
    }

    if (!data) {
        return null;
    }

    return (
        <>
            {data.map((publishedBlogEntry) => (
                <BlogEntryFromPublishedBlogEntryResponse
                    key={publishedBlogEntry.id}
                    publishedBlogEntryResponse={publishedBlogEntry}
                />
            ))}
        </>
    );
}
