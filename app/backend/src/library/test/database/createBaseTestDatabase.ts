import { ProjectLogger } from "@sside-net/project-logger";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { getDatabaseFileDirectoryPath } from "./getDatabaseFileDirectoryPath";

export default async function () {
    const logger = new ProjectLogger("createBaseTestDatabase");

    process.env.BASE_TEST_DATABASE_PATH = resolve(
        getDatabaseFileDirectoryPath(),
        `base.test.sqlite`,
    );
    process.env.DATABASE_URL = "file:" + process.env.BASE_TEST_DATABASE_PATH;

    logger.log("テスト用ベースDBの初期化を行います。", {
        NODE_ENV: process.env.NODE_ENV,
        APP_ENV: process.env.APP_ENV,
        BASE_TEST_DATABASE_PATH: process.env.BASE_TEST_DATABASE_PATH,
        DATABASE_URL: process.env.DATABASE_URL,
    });

    const command = `npx --no-install prisma migrate reset --force`;
    const result = execSync(command, {
        env: process.env,
    });

    logger.log("テスト用ベースDBを作成しました。", {
        command,
        result,
    });

    return;
}
