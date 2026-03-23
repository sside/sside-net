"use client";

import { FC, useMemo } from "react";
import Link from "next/link";
import { DateTimeFormat, parseIso8601ToJst } from "@sside-net/date-time";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { $apiClient } from "../../../library/api-client/api-client";
import { components } from "../../../library/api-client/backend-schema";
import { ManagementSectionHeader } from "../ManagementSectionHeader";

const BlogEntryTable: FC<{}> = ({}) => {
    const { data, error, isLoading } = $apiClient.useQuery(
        "get",
        `/blog-entry`,
    );
    const blogEntries = useMemo(() => data ?? [], [data]);

    const columnHelper =
        createColumnHelper<components["schemas"]["BlogEntryResponse"]>();
    const reactTable = useReactTable({
        data: blogEntries,
        columns: [
            columnHelper.accessor("title", {
                header: "title",
                cell: (props) => (
                    <Link
                        className="underline"
                        href={`/management/blog-entry/${props.row.getValue("slug")}/edit`}
                    >
                        {props.row.getValue("slug")}
                    </Link>
                ),
            }),
            columnHelper.accessor("slug", {
                header: "slug",
            }),
            columnHelper.accessor("updatedAt", {
                header: "updated at",
                cell: (props) =>
                    parseIso8601ToJst(props.getValue()).toFormat(
                        DateTimeFormat.JapaneseHourAndMinute,
                    ),
            }),
            columnHelper.accessor("publishAt", {
                header: "publish at",
                cell: (props) => {
                    const value = props.getValue();

                    return value ?
                            parseIso8601ToJst(value).toFormat(
                                DateTimeFormat.JapaneseHourAndMinute,
                            )
                        :   null;
                },
            }),
        ],
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading || !data) {
        return null;
    }

    if (error) {
        throw error;
    }

    return (
        <table className="blog-entry-table w-full">
            <thead className="bg-base2 border-collapse rounded-full border-s-0">
                {reactTable
                    .getHeaderGroups()
                    .map(({ id: headerGroupId, headers }) => (
                        <tr key={headerGroupId}>
                            {headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="p-3 text-start first:rounded-l-2xl last:rounded-r-2xl"
                                >
                                    {header.isPlaceholder ? null : (
                                        flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
            </thead>
            <tbody>
                {reactTable.getRowModel().rows.map((row) => (
                    <tr
                        key={row.id}
                        className="hover:bg-base02 not-last:border-b first:[&>td]:pt-4"
                    >
                        {row.getVisibleCells().map((cell) => (
                            <td
                                key={cell.id}
                                className="px-3 py-2"
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot>
                {reactTable.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder ? null : (
                                    flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext(),
                                    )
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    );
};

export const ManagementBlogEntryList: FC<{}> = ({}) => {
    return (
        <div className="management-blog-entry-list grid gap-8">
            <ManagementSectionHeader text="Blog Entry" />
            <BlogEntryTable />
        </div>
    );
};
