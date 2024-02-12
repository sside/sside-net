import { config } from "dotenv";
import { EnvironmentType } from "@sside-net/constant";
import * as process from "process";

class EnvironmentVariable {
    NODE_ENV = "";
}

export class Environment {
    type: EnvironmentType;

    variable: EnvironmentVariable;

    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;

    constructor() {
        config();

        if (
            !Object.values(EnvironmentType).includes(
                process.env.NODE_ENV as EnvironmentType,
            )
        ) {
            throw new Error(
                `環境変数NODE_ENVの値が不正です。NODE_ENV: ${process.env.NODE_ENV}`,
            );
        }
        this.type = process.env.NODE_ENV as EnvironmentType;

        this.variable = this.getEnvironmentVariable();

        const { Production, Development, Test } = EnvironmentType;
        this.isProduction = this.variable.NODE_ENV === Production;
        this.isDevelopment = this.variable.NODE_ENV === Development;
        this.isTest = this.variable.NODE_ENV === Test;
    }

    private getEnvironmentVariable(): EnvironmentVariable {
        const environmentVariable = new EnvironmentVariable();

        const failedKeys: string[] = [];
        for (const key in environmentVariable) {
            const actualValue = process.env[key];
            if (!actualValue) {
                failedKeys.push(key);
                continue;
            }

            environmentVariable[key as keyof EnvironmentVariable] = actualValue;
        }

        if (failedKeys.length) {
            throw new Error(
                `セットされていない環境変数があります。key: ${failedKeys.join(", ")}`,
            );
        }

        return environmentVariable;
    }
}
