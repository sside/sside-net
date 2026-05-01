import { DateTimeFormat } from "@sside-net/date-time";
import { DateTime } from "luxon";
import { IntegerPagePathParameter } from "../../../../../constant/path-parameter/IntegerPagePathParameter";
import { apiClient } from "../../../../../library/api-client/api-client";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../../library/path-parameter/getPagePathParameters";
import { captureApiCallError } from "../../../../../library/sentry/captureApiCallError";
import { ManagementEditExistBlogEntry } from "./ManagementEditExistBlogEntry";

export default async function EditBlogEntryPage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { blogEntryId } = await getPagePathParameters(
        nextPagePathParameter,
        IntegerPagePathParameter.BlogEntryId,
    );
    const { data, error, response } = await apiClient.GET(
        "/blog-entry/{blogEntryId}",
        {
            params: {
                path: {
                    blogEntryId,
                },
            },
        },
    );
    if (error) {
        throw captureApiCallError(response, EditBlogEntryPage);
    }
    const { title, slug, bodyMarkdown, metaTags, publishAt } = data;

    const publishAtIsoDateTimeLocal = (() => {
        const dateTime = DateTime.fromISO(publishAt || "");

        return dateTime.isValid ?
                dateTime.toFormat(DateTimeFormat.DateTimeLocal)
            :   "";
    })();

    return (
        <div className="edit-blog-entry-page">
            <ManagementEditExistBlogEntry
                blogEntryId={blogEntryId}
                existBlogEntry={{
                    title,
                    slug,
                    bodyMarkdown,
                    metaTagNames: metaTags.map(({ name }) => name),
                    publishAtIsoDateTimeLocal,
                }}
            />
        </div>
    );
}
