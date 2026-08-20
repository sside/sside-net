import { notImplementedStab } from "@sside-net/utility";
import { IntegerPathParameterName } from "../../../../../constant/path-parameter/IntegerPathParameterName";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../../library/path-parameter/getPagePathParameters";

export default async function YearMonthArchivePage(
    nextPageIntegerPathParameter: NextPagePathParameter,
) {
    const { year, month } = await getPagePathParameters(
        nextPageIntegerPathParameter,
        IntegerPathParameterName.Year,
        IntegerPathParameterName.Month,
    );

    return (
        <>
            {notImplementedStab(year)}
            {notImplementedStab(month)}
        </>
    );
}
