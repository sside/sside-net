import { notImplementedStab } from "@sside-net/utility";
import { StringPathParameterName } from "../../../../constant/path-parameter/StringPathParameterName";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";

export default async function MetaTagPage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { blogEntryMetaTag } = await getPagePathParameters(
        nextPagePathParameter,
        StringPathParameterName.BlogEntryMetaTag,
    );

    return <>{notImplementedStab(blogEntryMetaTag)}</>;
}
