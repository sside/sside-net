import { getAppConfig } from "@sside-net/app-config";
import { IntegerPagePathParameter } from "../../../../constant/path-parameter/IntegerPagePathParameter";
import { apiClient } from "../../../../library/api-client/api-client";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";
import { captureApiCallError } from "../../../../library/sentry/captureApiCallError";
import { BlogEntryFromPublishedBlogEntryResponse } from "../../_blog-entry/BlogEntryFromPublishedBlogEntryResponse";

export default async function YearArchivePage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { year } = await getPagePathParameters(
        nextPagePathParameter,
        IntegerPagePathParameter.Year,
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

    if (error) {
        captureApiCallError(response, YearArchivePage);
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
