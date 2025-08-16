// __dirnameからの相対パス指定を使っているため、このファイルは別のディレクトリに動かさないこと
import { ProjectLogger } from "@sside-net/project-logger";
import { execSync } from "node:child_process";
import * as console from "node:console";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const logger = new ProjectLogger("api-client");

export async function updateOpenApiDocument(
    openApiDocumentJson: string,
    isForceOverWrite = false,
    isLogClientGenerateCommandLog = false,
): Promise<void> {
    const OPEN_API_DOCUMENT_FILE_NAME = "open-api.json";
    const openApiFileSaveFullPath = resolve(
        __dirname,
        "..",
        OPEN_API_DOCUMENT_FILE_NAME,
    );

    logger.log("OpenAPIドキュメントを保存を試みます。", {
        openApiFileSaveFullPath,
        isForceOverWrite,
        isLogClientGenerateCommandLog,
    });

    if (
        !isForceOverWrite &&
        !(await isDocumentUpdated(openApiFileSaveFullPath, openApiDocumentJson))
    ) {
        logger.log("OpenApiドキュメントに変更がないため、更新は行いません。");

        return;
    }

    await writeFile(openApiFileSaveFullPath, openApiDocumentJson);
    logger.log("OpenAPIドキュメントを更新しました。");

    const clientGenerateLog = buildClientLibrary();
    if (isLogClientGenerateCommandLog) {
        console.log(clientGenerateLog);
    }

    return;
}

async function isDocumentUpdated(
    fileFullPath: string,
    openApiDocument: string,
): Promise<boolean> {
    logger.log("OpenAPIドキュメントが更新されているかチェックします。", {
        fileFullPath,
    });

    try {
        return (
            (await readFile(fileFullPath)).toString().trim() !==
            openApiDocument.trim()
        );
    } catch (e) {
        logger.warn(
            "既存のOpenAPIドキュメント取得時にエラー発生。",
            e as Error,
        );

        return false;
    }
}

function buildClientLibrary(): string {
    logger.log("OpenAPIクライアントを生成します。");

    return execSync(`npm run generate:client`, {
        cwd: resolve(__dirname, ".."),
    }).toString();
}
