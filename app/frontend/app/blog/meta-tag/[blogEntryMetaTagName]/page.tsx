import { notImplementedStab } from "@sside-net/utility";
import { StringPagePathParameter } from "../../../../constant/path-parameter/StringPagePathParameter";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";

export default async function MetaTagPage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { blogEntryMetaTag } = await getPagePathParameters(
        nextPagePathParameter,
        StringPagePathParameter.BlogEntryMetaTag,
    );

    return <>{notImplementedStab(blogEntryMetaTag)}</>;
}
