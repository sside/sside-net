import { StringSearchParameterName } from "../constant/search-parameter/StringSearchParameterName";

type SearchParameterKey = StringSearchParameterName;

export type NextPageSearchParameters = {
    searchParams: Promise<Record<SearchParameterKey, string>>;
};
