import { notFound } from "next/dist/client/components/not-found";
import { parseDecimalInt } from "@sside-net/utility";
import { IntegerPagePathParameter } from "../../constant/path-parameter/IntegerPagePathParameter";
import { StringPagePathParameter } from "../../constant/path-parameter/StringPagePathParameter";

type PathParameterKey = IntegerPagePathParameter | StringPagePathParameter;

export type NextPagePathParameter = {
    params: Promise<Record<PathParameterKey, string>>;
};

const getIntegerPagePathParameter = async (
    { params }: NextPagePathParameter,
    parameterName: IntegerPagePathParameter,
): Promise<number> => {
    const pickedPathParameter = parseDecimalInt((await params)[parameterName]);

    return Number.isNaN(pickedPathParameter) ? notFound() : pickedPathParameter;
};

const getStringPagePathParameter = async (
    { params }: NextPagePathParameter,
    parameterName: StringPagePathParameter,
) => {
    const pickedPathParameter = (await params)[parameterName];

    return pickedPathParameter || notFound();
};

type PickedPagePathParameter<T extends PathParameterKey[]> = {
    [Key in T[number]]: Key extends IntegerPagePathParameter ? number
    : Key extends StringPagePathParameter ? string
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
            Object.values(StringPagePathParameter).includes(
                parameterName as StringPagePathParameter,
            )
        ) {
            pageParameters[parameterName] = await getStringPagePathParameter(
                nextPagePathParameter,
                parameterName as StringPagePathParameter,
            );
        } else if (
            Object.values(IntegerPagePathParameter).includes(
                parameterName as IntegerPagePathParameter,
            )
        ) {
            pageParameters[parameterName] = await getIntegerPagePathParameter(
                nextPagePathParameter,
                parameterName as IntegerPagePathParameter,
            );
        }
    }

    return pageParameters as PickedPagePathParameter<T>;
};
