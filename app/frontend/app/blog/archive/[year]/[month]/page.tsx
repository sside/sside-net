import { notFound } from "next/navigation";
import { validateMonth, validateYear } from "@sside-net/validator";
import { IntegerPathParameterName } from "../../../../../constant/path-parameter/IntegerPathParameterName";
import { apiClient } from "../../../../../library/api-client/api-client";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../../library/path-parameter/getPagePathParameters";
import { captureApiCallError } from "../../../../../library/sentry/captureApiCallError";
import { NextPageSearchParameters } from "../../../../../type/NextPageSearchParameter";
import { BlogEntriesFromPublishedBlogEntryResponses } from "../../../BlogEntriesFromPublishedBlogEntryResponses";
import { YearAndMonthlyEntryArchivePager } from "./YearAndMonthlyEntryArchivePager";

export default async function YearMonthArchivePage(
    nextPageParameter: NextPagePathParameter & NextPageSearchParameters,
) {
    const { year, month } = await getPagePathParameters(
        nextPageParameter,
        IntegerPathParameterName.Year,
        IntegerPathParameterName.Month,
    );
    if (
        [validateYear(year), validateMonth(month)].some(
            (result) => result !== true,
        )
    ) {
        return notFound();
    }

    const { data, error, response } = await apiClient.GET(
        "/blog-entry/archive/{year}/{month}",
        {
            params: {
                path: {
                    year,
                    month,
                },
            },
        },
    );

    if (error) {
        await captureApiCallError(response, YearMonthArchivePage);
        throw error;
    }

    if (!data.length) {
        return notFound();
    }

    return (
        <div className="year-month-archive-page grid w-full gap-4">
            <BlogEntriesFromPublishedBlogEntryResponses
                publishedBlogEntryResponses={data}
            />
            <YearAndMonthlyEntryArchivePager
                year={year}
                month={month}
            />
        </div>
    );
}
