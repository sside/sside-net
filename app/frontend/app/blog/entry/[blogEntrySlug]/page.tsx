import { notImplementedStab } from "@sside-net/utility";
import { StringPagePathParameter } from "../../../../constant/path-parameter/StringPagePathParameter";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";

export default async function BlogEntryBySlugPage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { blogEntrySlug } = await getPagePathParameters(
        nextPagePathParameter,
        StringPagePathParameter.BlogEntrySlug,
    );

    return <>{notImplementedStab(blogEntrySlug)}</>;
}
