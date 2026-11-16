import { FC } from "react";
import { Route } from "next";
import { unique } from "@sside-net/utility";
import { AdjacentBlogLink } from "../../../../component/adjacent-blog-link/AdjacentBlogLink";
import { AdjacentBlogLinksContainer } from "../../../../component/adjacent-blog-link/AdjacentBlogLinksContainer";
import { apiClient } from "../../../../library/api-client/api-client";
import { captureApiCallError } from "../../../../library/sentry/captureApiCallError";

export const YearlyBlogEntryArchivePager: FC<{ year: number }> = async ({
    year,
}) => {
    const { data, error, response } = await apiClient.GET(
        "/blog-entry/archive-year-month",
    );

    if (error) {
        await captureApiCallError(response, YearlyBlogEntryArchivePager);

        return null;
    }

    const years = unique(data.map(({ year }) => year) || []).toSorted(
        (a, b) => a - b,
    );
    const currentIndex = years.indexOf(year);
    const nextYear = years[currentIndex + 1];
    const previousYear = years[currentIndex - 1];

    return (
        <div className="yearly-blog-entry-archive-pager">
            <AdjacentBlogLinksContainer
                next={
                    !!previousYear && (
                        <AdjacentBlogLink
                            href={`/blog/archive/${previousYear}` as Route}
                            headerText="next >>>"
                            bodyText={previousYear.toString(10)}
                        />
                    )
                }
                previous={
                    !!nextYear && (
                        <AdjacentBlogLink
                            href={`/blog/archive/${nextYear}` as Route}
                            headerText="<<< previous"
                            bodyText={nextYear.toString(10)}
                        />
                    )
                }
            />
        </div>
    );
};
