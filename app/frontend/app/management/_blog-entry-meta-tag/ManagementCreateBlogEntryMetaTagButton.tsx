"use client";

import { FC } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "../../../component/button/Button";
import { ApiClientErrorResponse } from "../../../library/api-client/ApiClientErrorResponse";
import { apiClient } from "../../../library/api-client/api-client";

export const ManagementCreateBlogEntryMetaTagButton: FC<{}> = ({}) => {
    const queryClient = useQueryClient();

    return (
        <div className="management-create-blog-entry-meta-tag-button">
            <Button
                type="button"
                onClick={async () => {
                    const metaTagName = prompt("input meta tag name");
                    if (!metaTagName) {
                        return;
                    }

                    try {
                        const { error } = await apiClient.POST(
                            "/private/blog-entry-meta-tag",
                            {
                                body: {
                                    name: metaTagName,
                                },
                            },
                        );
                        if (error) {
                            toast.error(
                                (error as ApiClientErrorResponse).message,
                                {
                                    className: "w-full",
                                },
                            );
                        } else {
                            toast.success(
                                `MetaTag "${metaTagName}" を作成しました。`,
                                {
                                    className: "w-full",
                                },
                            );
                        }
                    } catch (e) {
                        toast.error(
                            (e as Error).message ||
                                "MetaTag作成時にエラーが発生しました。",
                            {
                                className: "w-full",
                            },
                        );
                    }

                    await queryClient.refetchQueries({
                        queryKey: ["get", `/private/blog-entry-meta-tag`],
                    });
                }}
            >
                Create
            </Button>
            <Toaster />
        </div>
    );
};
