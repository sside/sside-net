import { config } from "dotenv";
import { execSync } from "node:child_process";

export const prepareTestDatabase = (
    isSkipSeed = true,
    isShowConsoleLog = false,
): void => {
    config();
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl || !/^postgresql:\/\//.test(databaseUrl)) {
        throw new Error(
            `環境変数DATABASE_URLが不正です。 DATABASE_URL: ${databaseUrl}`,
        );
    }

    const [url, searchParameters] = databaseUrl.split("?");
    const [protocol, connectionInformation, databaseName] =
        url.split(/\/\/|\//);
    const testDatabaseName = /_test_\d/.test(databaseName)
        ? databaseName
        : `${databaseName}_test_${process.env.JEST_WORKER_ID}`;
    let testDatabaseUrl = `${protocol}//${connectionInformation}/${testDatabaseName}`;
    if (searchParameters) {
        testDatabaseUrl += `?${searchParameters}`;
    }
    process.env.DATABASE_URL = testDatabaseUrl;

    let command = `npx prisma migrate reset --force --skip-generate`;
    if (isSkipSeed) {
        command += " --skip-seed";
    }

    const commandOutput = execSync(command, {
        env: {
            ...process.env,
        },
    }).toString();

    if (isShowConsoleLog) {
        console.log("Prepare test database", process.env.DATABASE_URL);
        console.log(commandOutput);
    }
};
