"use client";

import { ComponentProps, FC } from "react";
import { useRouter } from "next/navigation";
import { DateTimeFormat } from "@sside-net/date-time";
import { DateTime } from "luxon";
import {
    $apiClient,
    apiClient,
} from "../../../../../library/api-client/api-client";
import { BackendErrorDisplay } from "../../../_backend-error/BackendErrorDisplay";
import { ManagementEditBlogEntryForm } from "../../ManagementEditBlogEntryForm";

export const ManagementEditExistBlogEntry: FC<{
    blogEntryId: number;
}> = ({ blogEntryId }) => {
    const router = useRouter();

    const { data, error, isLoading } = $apiClient.useQuery(
        "get",
        "/private/blog-entry/{blogEntryId}",
        {
            params: {
                path: {
                    blogEntryId,
                },
            },
        },
    );

    if (isLoading || !data) {
        return null;
    }

    if (error) {
        return (
            <BackendErrorDisplay
                errorMessage={`BlogEntryの取得に失敗しました。blogEntryId: ${blogEntryId}`}
                errorResponse={error}
            />
        );
    }

    const { title, slug, bodyMarkdown, metaTags, publishAt } = data;
    const existBlogEntry: ComponentProps<
        typeof ManagementEditBlogEntryForm
    >["initialInput"] = {
        title,
        slug,
        bodyMarkdown,
        metaTagNames: metaTags.map(({ name }) => name),
        publishAtIsoDateTimeLocal: ((): string => {
            const dateTime = DateTime.fromISO(publishAt ?? "");

            return dateTime.isValid ?
                    dateTime.toFormat(DateTimeFormat.DateTimeLocal)
                :   "";
        })(),
    };

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
                    await apiClient.PUT(
                        "/private/blog-entry/{blogEntryId}/publish",
                        {
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
                                            publishAtDateTime.toISO()!
                                        :   undefined;
                                })(),
                            },
                        },
                    );

                    return router.push(`/management`);
                }}
                onSubmitSaveDraft={async ({
                    title,
                    slug,
                    bodyMarkdown,
                    metaTagNames,
                }) => {
                    await apiClient.PUT(
                        "/private/blog-entry/{blogEntryId}/draft",
                        {
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
                        },
                    );

                    return router.push(`/management`);
                }}
                initialInput={existBlogEntry}
            />
        </div>
    );
};
