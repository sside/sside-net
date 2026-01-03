import { ProjectLogger } from "@sside-net/project-logger";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * テスト用DBを作成し、環境変数DATABASE_URLにセットします。
 */
export const prepareTestDatabase = (): void => {
    const logger = new ProjectLogger("prepareTestDatabase");

    if (!process.env.JEST_WORKER_ID) {
        throw new Error(`環境変数JEST_WORKER_IDが未定義です。`);
    }
    if (!process.env.BASE_TEST_DATABASE_PATH) {
        throw new Error(`環境変数BASE_TEST_DATABASE_PATHが未定義です。`);
    }

    const outputFullPath = resolve(
        process.env.BASE_TEST_DATABASE_PATH,
        "..",
        process.env.JEST_WORKER_ID.padStart(3, "0") + `.test.sqlite`,
    );

    process.env.DATABASE_URL = "file:" + outputFullPath;

    logger.log("テスト用DBをコピーします。", {
        NODE_ENV: process.env.NODE_ENV,
        APP_ENV: process.env.APP_ENV,
        JEST_WORKER_ID: process.env.JEST_WORKER_ID,
        BASE_TEST_DATABASE_PATH: process.env.BASE_TEST_DATABASE_PATH,
        outputFullPath,
        DATABASE_URL: process.env.DATABASE_URL,
    });

    copyFileSync(process.env.BASE_TEST_DATABASE_PATH, outputFullPath);

    return;
};
