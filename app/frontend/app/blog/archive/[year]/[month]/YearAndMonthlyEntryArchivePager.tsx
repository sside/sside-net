import { FC } from "react";
import { Route } from "next";
import { AdjacentBlogLink } from "../../../../../component/adjacent-blog-link/AdjacentBlogLink";
import { AdjacentBlogLinksContainer } from "../../../../../component/adjacent-blog-link/AdjacentBlogLinksContainer";
import { apiClient } from "../../../../../library/api-client/api-client";
import { captureApiCallError } from "../../../../../library/sentry/captureApiCallError";

export const YearAndMonthlyEntryArchivePager: FC<{
    year: number;
    month: number;
}> = async ({ year, month }) => {
    const { data, error, response } = await apiClient.GET(
        "/blog-entry/archive-year-month",
    );

    if (error) {
        await captureApiCallError(response, YearAndMonthlyEntryArchivePager);

        return null;
    }

    const sorted = data.toSorted(
        ({ year: aYear, month: aMonth }, { year: bYear, month: bMonth }) => {
            if (aYear !== bYear) {
                return aYear - bYear;
            }

            return aMonth - bMonth;
        },
    );
    const currentIndex = sorted.findIndex(
        (yearMonth) => yearMonth.year === year && yearMonth.month === month,
    );
    if (currentIndex === -1) {
        return null;
    }

    const earlier = sorted[currentIndex - 1];
    const later = sorted[currentIndex + 1];

    const formatYearMonth = ({ year, month }: (typeof sorted)[0]) =>
        `${year}-${month.toString(10).padStart(2, "0")}`;

    return (
        <div className="year-and-monthly-entry-archive-pager">
            <AdjacentBlogLinksContainer
                next={
                    !!earlier && (
                        <AdjacentBlogLink
                            href={
                                `/blog/archive/${formatYearMonth(earlier).replace("-", "/")}` as Route
                            }
                            headerText="next"
                            bodyText={formatYearMonth(earlier)}
                        />
                    )
                }
                previous={
                    !!later && (
                        <AdjacentBlogLink
                            href={
                                `/blog/archive/${formatYearMonth(later).replace("-", "/")}` as Route
                            }
                            headerText="previous"
                            bodyText={formatYearMonth(later)}
                        />
                    )
                }
            />
        </div>
    );
};
