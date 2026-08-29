import { FC } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { apiClient } from "../../../library/api-client/api-client";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";
import { BlogMenuSection } from "./BlogMenuSection";

const archivePadding = "py-1 px-2";

const ArchiveYear: FC<{ year: number }> = ({ year }) => (
    <Link
        className={twMerge(
            "border-base01 bg-base01 text-base2 w-fit rounded-md border",
            archivePadding,
        )}
        href={`/blog/archive/${year}`}
    >
        {year}
    </Link>
);

const ArchiveMonth: FC<{ year: number; month: number }> = ({ year, month }) => (
    <Link
        className={twMerge(
            "border-base01 w-fit rounded-md border",
            archivePadding,
        )}
        href={`/blog/archive/${year}/${month}`}
    >
        {month}
    </Link>
);

export const BlogMenuArchives: FC<{}> = async ({}) => {
    const { data, error, response } = await apiClient.GET(
        "/blog-entry/archive-year-month",
    );

    if (error) {
        await captureApiCallError(response, BlogMenuArchives);
    }

    const archiveYearMonths = data ?? [];

    const years = [
        ...new Set(archiveYearMonths.map(({ year }) => year)),
    ].toSorted((a, b) => b - a);

    return (
        <div className="blog-menu-archives">
            <BlogMenuSection headerLabel="Archives">
                <div className="grid gap-1 py-2">
                    {years.map((year) => (
                        <div
                            key={year}
                            className="grid gap-1"
                        >
                            <ArchiveYear year={year} />
                            <div className="flex flex-wrap gap-2">
                                {archiveYearMonths
                                    .filter(
                                        ({ year: dataYear }) =>
                                            dataYear === year,
                                    )
                                    .map(({ month }) => month)
                                    .toSorted((a, b) => a - b)
                                    .map((month) => (
                                        <ArchiveMonth
                                            key={[year, month].join("_")}
                                            year={year}
                                            month={month}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </BlogMenuSection>
        </div>
    );
};
