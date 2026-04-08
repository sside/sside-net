import { FC, useId } from "react";
import "@yaireo/tagify/dist/tagify.css";
import Tags from "@yaireo/tagify/react";
import { $apiClient } from "../../../../library/api-client/api-client";
import { captureApiCallError } from "../../../../library/sentry/captureApiCallError";
import "./ManagementBlogEntryMetaTagTagifyCustom.css";
import { ManagementInputSet } from "./ManagementInputSet";

export const ManagementBlogEntryMetaTagInputSet: FC<{
    onChange: (metaTagNames: string[]) => unknown;
    initialValue?: string[];
}> = ({ onChange, initialValue }) => {
    const id = useId();
    const { data, isLoading, error } = $apiClient.useQuery(
        "get",
        "/blog-entry-meta-tag",
    );

    if (error) {
        throw captureApiCallError(error, ManagementBlogEntryMetaTagInputSet);
    }

    return (
        <div className="management-blog-entry-meta-tag-input-set">
            <ManagementInputSet
                label="Meta tag"
                htmlFor={id}
            >
                <Tags
                    className=""
                    loading={isLoading}
                    whitelist={data?.map(({ name }) => name)}
                    placeholder="Input blog entry meta tags"
                    settings={{
                        trim: true,
                    }}
                    value={initialValue}
                    onChange={(e) =>
                        onChange(
                            e.detail.tagify
                                .getCleanValue()
                                .map(({ value }) => value),
                        )
                    }
                />
            </ManagementInputSet>
        </div>
    );
};
