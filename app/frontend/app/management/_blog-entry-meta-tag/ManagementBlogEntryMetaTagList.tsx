"use client";

import { FC, useMemo } from "react";
import { notImplementedVoid, parseDecimalInt } from "@sside-net/utility";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { $apiClient } from "../../../library/api-client/api-client";
import { components } from "../../../library/api-client/backend-schema";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";
import { ManagementSectionHeader } from "../ManagementSectionHeader";

const DeleteIcon: FC<{ blogMetaTagId: number; metaTagName: string }> = ({
    blogMetaTagId,
    metaTagName,
}) => {
    const deleteBlogMetaTag = async () => {
        const isDelete = confirm(`${metaTagName}を削除しますか`);
        if (!isDelete) {
            return;
        }

        notImplementedVoid({
            deleteBlogMetaTagId: blogMetaTagId,
        });
    };

    return <FaTrashCan onClick={deleteBlogMetaTag} />;
};

const RenameIcon: FC<{ blogMetaTagId: number; currentName: string }> = ({
    blogMetaTagId,
    currentName,
}) => {
    const renameBlogMetaTag = async (): Promise<void> => {
        const updateName = prompt("BlogMetaTagの名称を変更", currentName);
        if (!updateName || updateName === currentName) {
            return;
        }

        notImplementedVoid({
            blogMetaTagId,
            updateName,
        });
    };

    return <FaEdit onClick={renameBlogMetaTag} />;
};

const BlogMetaTagTable: FC = () => {
    const { data, error, isLoading } = $apiClient.useQuery(
        "get",
        `/blog-entry-meta-tag`,
    );
    const metaTags = useMemo(() => data ?? [], [data]);

    const columnHelper =
        createColumnHelper<
            components["schemas"]["BlogEntryMetaTagCountResponse"]
        >();
    const reactTable = useReactTable({
        data: metaTags,
        columns: [
            columnHelper.accessor("id", {
                header: () => <></>,
                cell: () => <></>,
            }),
            columnHelper.accessor("name", {
                header: "name",
            }),
            columnHelper.accessor("count", {
                header: "blog entry count",
            }),
            {
                header: "operation",
                cell: (props) => (
                    <div className="flex">
                        <RenameIcon
                            blogMetaTagId={parseDecimalInt(
                                props.row.getValue("id"),
                            )}
                            currentName={props.row.getValue("name")}
                        />
                        <DeleteIcon
                            blogMetaTagId={parseDecimalInt(props.row.id)}
                            metaTagName={props.row.getValue("name")}
                        />
                    </div>
                ),
            },
        ],
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading || !data) {
        return null;
    }

    if (error) {
        throw captureApiCallError(error, BlogMetaTagTable);
    }

    return (
        <table className="blog-entry-table w-full">
            <thead className="bg-base0 text-base03 border-collapse rounded-full border-s-0">
                {reactTable
                    .getHeaderGroups()
                    .map(({ id: headerGroupId, headers }) => (
                        <tr key={headerGroupId}>
                            {headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="p-3 text-start text-xl first:hidden last:rounded-r-2xl nth-[2]:rounded-l-2xl"
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
                                className="px-3 py-2 first:hidden"
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

export const ManagementBlogEntryMetaTagList: FC<{}> = ({}) => {
    return (
        <div className="management-blog-entry-meta-tag-list grid gap-8">
            <ManagementSectionHeader text="Blog Entry Meta Tag" />
            <BlogMetaTagTable />
        </div>
    );
};
