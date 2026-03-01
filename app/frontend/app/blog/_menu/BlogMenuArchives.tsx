import { FC, Fragment } from "react";
import Link from "next/link";
import { apiClient } from "../../../library/api-client/api-client";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";
import { BlogMenuSection } from "./BlogMenuSection";

const ArchiveYear: FC<{ year: number }> = ({ year }) => (
    <Link
        className="border-base01 rounded-md border p-2"
        href={`/blog/archive/${year}`}
    >
        {year}
    </Link>
);

const ArchiveMonth: FC<{ year: number; month: number }> = ({ year, month }) => (
    <Link
        className="border-base01 rounded-md border p-2"
        href={`/blog/archive/${year}/${month}`}
    >
        {month}
    </Link>
);

export const BlogMenuArchives: FC<{}> = async ({}) => {
    const { data, error, response } = await apiClient.GET(
        "/public-blog-entry/archive-year-month",
    );

    if (error) {
        captureApiCallError(response, BlogMenuArchives);
    }

    const archiveYearMonths =
        error ?
            []
        :   data.toSorted(
                (
                    { year: aYear, month: aMonth },
                    { year: bYear, month: bMonth },
                ) => (aYear === bYear ? aMonth - bMonth : bYear - aYear),
            );

    return (
        <BlogMenuSection headerLabel="Archives">
            <div className="blog-menu-archives flex flex-wrap gap-2">
                {archiveYearMonths.map(({ year, month }, index) => (
                    <Fragment key={`${year}-${month}`}>
                        {archiveYearMonths.at(index - 1)?.year !== year && (
                            <div className="w-full">
                                <ArchiveYear year={year} />
                            </div>
                        )}
                        <ArchiveMonth
                            year={year}
                            month={month}
                        />
                    </Fragment>
                ))}
            </div>
        </BlogMenuSection>
    );
};
