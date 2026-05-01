"use client";

import { FC } from "react";
import { apiClient } from "../../../../library/api-client/api-client";
import { ManagementEditBlogEntryForm } from "../ManagementEditBlogEntryForm";

export const ManagementCreateBlogEntry: FC<{}> = ({}) => {
    return (
        <div className="management-create-blog-entry">
            <ManagementEditBlogEntryForm
                onSubmitPublish={async ({
                    metaTagNames,
                    publishAtIsoDateTimeLocal,
                    ...blogEntryFormInput
                }) => {
                    await apiClient.POST(`/blog-entry/publish`, {
                        body: {
                            ...blogEntryFormInput,
                            blogEntryMetaTagNames: metaTagNames,
                            publishAt: publishAtIsoDateTimeLocal || undefined,
                        },
                    });
                }}
                onSubmitSaveDraft={async ({
                    metaTagNames,
                    ...blogEntryFormInput
                }) => {
                    await apiClient.POST(`/blog-entry/draft`, {
                        body: {
                            ...blogEntryFormInput,
                            blogEntryMetaTagNames: metaTagNames,
                        },
                    });
                }}
            />
        </div>
    );
};
