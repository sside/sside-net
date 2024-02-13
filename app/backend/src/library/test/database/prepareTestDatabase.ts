import { config } from "dotenv";
import { execSync } from "child_process";

export const prepareTestDatabase = (
    isSkipSeeding = false,
    isOutputCommandLog = false,
): void => {
    config();
    const databaseUrlEnvironmentVariable = process.env.DATABASE_URL;

    if (
        !databaseUrlEnvironmentVariable ||
        !/^postgresql:\/\//.test(databaseUrlEnvironmentVariable)
    ) {
        throw new Error(
            `環境変数DATABASE_URLが未設定、または不正です。DATABASE_URL: ${databaseUrlEnvironmentVariable}`,
        );
    }

    // postgresqlのURLをnew URL()しても、中身が抜けてしまう(！)ので、手で書き換える
    const [url, searchParam] = databaseUrlEnvironmentVariable.split("?");
    const [protocol, connectionInformation, databaseName] =
        url.split(/\/\/|\//);
    const testDatabaseName = /_test_\d+$/.test(databaseName)
        ? databaseName
        : `${databaseName}_test_${process.env.JEST_WORKER_ID}`;
    let databaseUrl = `${protocol}//${connectionInformation}/${testDatabaseName}`;
    if (searchParam) {
        databaseUrl += `?${searchParam}`;
    }
    process.env.DATABASE_URL = databaseUrl;

    let command = "yarn prisma migrate reset --force --skip-generate";
    if (isSkipSeeding) {
        command += " --skip-seed";
    }
    const output = execSync(command, {
        env: {
            ...process.env,
        },
    }).toString();

    if (isOutputCommandLog) {
        console.log("Prepare test database.", process.env.DATABASE_URL);
        console.log(output);
    }

    return;
};
