import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { getDatabaseFileDirectoryPath } from "./getDatabaseFileDirectoryPath";

export const prepareTestDatabase = ({
    isSkipSeeding = false,
    isLogCommandResult = false,
}: {
    isSkipSeeding?: boolean;
    isLogCommandResult?: boolean;
}): void => {
    console.log(isSkipSeeding, isLogCommandResult);
    const jestWorkerId = process.env.JEST_WORKER_ID;
    if (!jestWorkerId) {
        throw new Error(`環境変数JEST_WORKER_IDが未定義です。`);
    }

    process.env.DATABASE_URL =
        "file:" +
        resolve(
            getDatabaseFileDirectoryPath(),
            jestWorkerId.padStart(3, "0") + `.test.sqlite`,
        );

    let command =
        "npx --no-install prisma migrate reset --force --skip-generate";
    if (isSkipSeeding) {
        command += " --skip-seed";
    }
    const result = execSync(command, {
        env: process.env,
    });

    if (isLogCommandResult) {
        console.log(
            `テスト用データベース初期化。NODE_ENV: ${process.env.NODE_ENV}`,
        );
        console.log(command);
        console.log(result.toString());
    }

    return;
};
