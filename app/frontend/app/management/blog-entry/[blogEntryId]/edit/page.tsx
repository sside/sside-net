import { IntegerPathParameterName } from "../../../../../constant/path-parameter/IntegerPathParameterName";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../../library/path-parameter/getPagePathParameters";
import { ManagementEditExistBlogEntry } from "./ManagementEditExistBlogEntry";

export default async function EditBlogEntryPage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { blogEntryId } = await getPagePathParameters(
        nextPagePathParameter,
        IntegerPathParameterName.BlogEntryId,
    );

    return (
        <div className="edit-blog-entry-page">
            <ManagementEditExistBlogEntry blogEntryId={blogEntryId} />
        </div>
    );
}
