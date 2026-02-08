import { notImplementedStab } from "@sside-net/utility";
import { IntegerPagePathParameter } from "../../../../constant/path-parameter/IntegerPagePathParameter";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../library/path-parameter/getPagePathParameters";

export default async function YearArchivePage(
    nextPagePathParameter: NextPagePathParameter,
) {
    const { year } = await getPagePathParameters(
        nextPagePathParameter,
        IntegerPagePathParameter.Year,
    );

    return <>{notImplementedStab(year)}</>;
}
