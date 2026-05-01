"use client";

import { ComponentProps, FC } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import { apiClient } from "../../../../../library/api-client/api-client";
import { ManagementEditBlogEntryForm } from "../../ManagementEditBlogEntryForm";

export const ManagementEditExistBlogEntry: FC<{
    blogEntryId: number;
    existBlogEntry: ComponentProps<
        typeof ManagementEditBlogEntryForm
    >["initialInput"];
}> = ({ blogEntryId, existBlogEntry }) => {
    const router = useRouter();

    return (
        <div className="management-edit-exist-blog-entry">
            <ManagementEditBlogEntryForm
                onSubmitPublish={async ({
                    title,
                    slug,
                    bodyMarkdown,
                    metaTagNames,
                    publishAtIsoDateTimeLocal,
                }) => {
                    await apiClient.PUT("/blog-entry/{blogEntryId}/publish", {
                        params: {
                            path: {
                                blogEntryId,
                            },
                        },
                        body: {
                            title,
                            slug,
                            bodyMarkdown,
                            blogEntryMetaTagNames: metaTagNames,
                            publishAt: (() => {
                                const publishAtDateTime = DateTime.fromISO(
                                    publishAtIsoDateTimeLocal || "",
                                );

                                return publishAtDateTime.isValid ?
                                        publishAtDateTime.toISO()
                                    :   undefined;
                            })(),
                        },
                    });

                    return router.push(`/management`);
                }}
                onSubmitSaveDraft={async ({
                    title,
                    slug,
                    bodyMarkdown,
                    metaTagNames,
                }) => {
                    await apiClient.PUT("/blog-entry/{blogEntryId}/draft", {
                        params: {
                            path: {
                                blogEntryId,
                            },
                        },
                        body: {
                            title,
                            slug,
                            bodyMarkdown,
                            blogEntryMetaTagNames: metaTagNames,
                        },
                    });

                    return router.push(`/management`);
                }}
                initialInput={existBlogEntry}
            />
        </div>
    );
};
