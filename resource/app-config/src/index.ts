import { EnvironmentType } from "@sside-net/constant";
import { DeepPartial } from "utility-types";

interface ApplicationConfiguration {
    siteName: "sside.net";
}

const base = {
    siteName: "sside.net",
} satisfies DeepPartial<ApplicationConfiguration>;

const development: ApplicationConfiguration = {
    ...base,
};

const production: ApplicationConfiguration = {
    ...base,
};

const test: ApplicationConfiguration = {
    ...base,
};

export const getApplicationConfig = (
    environmentType: EnvironmentType,
): ApplicationConfiguration => {
    const { Production, Development, Test } = EnvironmentType;
    switch (environmentType) {
        case Production:
            return production;
        case Development:
            return development;
        case Test:
            return test;
        default:
            throw new Error(
                `未定義の環境が指定されました。environment type: ${environmentType}`,
            );
    }
};
