import { ProjectLogger } from "@sside-net/project-logger";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { getDatabaseFileDirectoryPath } from "./getDatabaseFileDirectoryPath";

/**
 * テスト用DBを作成し、環境変数DATABASE_URLにセットする。
 * @param isLogCommandResult
 */
export const prepareTestDatabase = (isLogCommandResult = false): void => {
    const logger = new ProjectLogger("prepareTestDatabase");
    const jestWorkerId = process.env.JEST_WORKER_ID;

    logger.log("テスト用DBの初期化を行います。", {
        NODE_ENV: process.env.NODE_ENV,
        APP_ENV: process.env.APP_ENV,
        JEST_WORKER_ID: process.env.JEST_WORKER_ID,
        isLogCommandResult,
        jestWorkerId,
    });

    if (!process.env.JEST_WORKER_ID) {
        throw new Error(`環境変数JEST_WORKER_IDが未定義です。`);
    }

    process.env.DATABASE_URL =
        "file:" +
        resolve(
            getDatabaseFileDirectoryPath(),
            process.env.JEST_WORKER_ID.padStart(3, "0") + `.test.sqlite`,
        );

    const command = `npx --no-install prisma migrate reset --force --skip-generate --skip-seed`;
    const result = execSync(command, {
        env: process.env,
    });

    if (isLogCommandResult) {
        logger.log(`テスト用DB初期化実行。`, {
            NODE_ENV: process.env.NODE_ENV,
            APP_ENV: process.env.APP_ENV,
            DATABASE_URL: process.env.DATABASE_URL,
            command,
            result: result.toString(),
        });
    }

    return;
};
