import { notImplementedStab } from "@sside-net/utility";
import { IntegerPagePathParameter } from "../../../../../constant/path-parameter/IntegerPagePathParameter";
import {
    getPagePathParameters,
    NextPagePathParameter,
} from "../../../../../library/path-parameter/getPagePathParameters";

export default async function YearMonthArchivePage(
    nextPageIntegerPathParameter: NextPagePathParameter,
) {
    const { year, month } = await getPagePathParameters(
        nextPageIntegerPathParameter,
        IntegerPagePathParameter.Year,
        IntegerPagePathParameter.Month,
    );

    return (
        <>
            {notImplementedStab(year)}
            {notImplementedStab(month)}
        </>
    );
}
