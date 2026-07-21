/* eslint-disable no-console */
// __dirnameからの相対パス指定を使っているため、このファイルは別のディレクトリに動かさないこと
import { execSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

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

    console.log("OpenAPIドキュメントを保存を試みます。", {
        openApiFileSaveFullPath,
        isForceOverWrite,
        isLogClientGenerateCommandLog,
    });

    if (
        !isForceOverWrite &&
        !(await isDocumentUpdated(openApiFileSaveFullPath, openApiDocumentJson))
    ) {
        console.log("OpenApiドキュメントに変更がないため、更新は行いません。");

        return;
    }

    await writeFile(openApiFileSaveFullPath, openApiDocumentJson);
    console.log("OpenAPIドキュメントを更新しました。");

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
    console.log("OpenAPIドキュメントが更新されているかチェックします。", {
        fileFullPath,
    });

    try {
        return (
            (await readFile(fileFullPath)).toString().trim() !==
            openApiDocument.trim()
        );
    } catch (e) {
        console.warn(
            "既存のOpenAPIドキュメント取得時にエラー発生。",
            e as Error,
        );

        return false;
    }
}

function buildClientLibrary(): string {
    console.log("OpenAPIクライアントを生成します。");

    return execSync(`npm run generate:client`, {
        cwd: resolve(__dirname, ".."),
    }).toString();
}
