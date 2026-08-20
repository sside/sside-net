import { notFound } from "next/navigation";
import { parseDecimalInt } from "@sside-net/utility";
import { IntegerPathParameterName } from "../../constant/path-parameter/IntegerPathParameterName";
import { StringPathParameterName } from "../../constant/path-parameter/StringPathParameterName";

type PathParameterKey = IntegerPathParameterName | StringPathParameterName;

export type NextPagePathParameter = {
    params: Promise<Record<PathParameterKey, string>>;
};

const getIntegerPagePathParameter = async (
    { params }: NextPagePathParameter,
    parameterName: IntegerPathParameterName,
): Promise<number> => {
    const pickedPathParameter = parseDecimalInt((await params)[parameterName]);

    return Number.isNaN(pickedPathParameter) ? notFound() : pickedPathParameter;
};

const getStringPagePathParameter = async (
    { params }: NextPagePathParameter,
    parameterName: StringPathParameterName,
) => {
    const pickedPathParameter = (await params)[parameterName];

    return pickedPathParameter || notFound();
};

type PickedPagePathParameter<T extends PathParameterKey[]> = {
    [Key in T[number]]: Key extends IntegerPathParameterName ? number
    : Key extends StringPathParameterName ? string
    : never;
};
export const getPagePathParameters = async <
    T extends [PathParameterKey, ...PathParameterKey[]],
>(
    nextPagePathParameter: NextPagePathParameter,
    ...parameterNames: T
): Promise<PickedPagePathParameter<T>> => {
    const pageParameters: Record<string, string | number> = {};

    for (const parameterName of parameterNames) {
        if (
            Object.values(StringPathParameterName).includes(
                parameterName as StringPathParameterName,
            )
        ) {
            pageParameters[parameterName] = await getStringPagePathParameter(
                nextPagePathParameter,
                parameterName as StringPathParameterName,
            );
        } else if (
            Object.values(IntegerPathParameterName).includes(
                parameterName as IntegerPathParameterName,
            )
        ) {
            pageParameters[parameterName] = await getIntegerPagePathParameter(
                nextPagePathParameter,
                parameterName as IntegerPathParameterName,
            );
        }
    }

    return pageParameters as PickedPagePathParameter<T>;
};
