import { notFound } from "next/navigation";
import { validateYear } from "@sside-net/validator";
import { IntegerPathParameterName } from "../../../../constant/path-parameter/IntegerPathParameterName";
import { apiClient } from "../../../../library/api-client/api-client";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";
import { captureApiCallError } from "../../../../library/sentry/captureApiCallError";
import { BlogEntriesFromPublishedBlogEntryResponses } from "../../BlogEntriesFromPublishedBlogEntryResponses";
import { YearlyBlogEntryArchivePager } from "./YearlyBlogEntryArchivePager";

export default async function YearArchivePage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { year } = await getPagePathParameters(
        nextPagePathParameter,
        IntegerPathParameterName.Year,
    );
    if (validateYear(year) !== true) {
        return notFound();
    }

    const { data, error, response } = await apiClient.GET(
        "/blog-entry/archive/{year}",
        {
            params: {
                path: {
                    year,
                },
            },
        },
    );

    if (error) {
        await captureApiCallError(response, YearArchivePage);

        throw error;
    }

    if (!data.length) {
        return notFound();
    }

    return (
        <div className="year-archive-page grid w-full gap-4">
            <BlogEntriesFromPublishedBlogEntryResponses
                publishedBlogEntryResponses={data}
            />
            <YearlyBlogEntryArchivePager year={year} />
        </div>
    );
}
