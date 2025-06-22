import Ignore from "ignore";
import InquirerAutoCompletePrompt from "inquirer-autocomplete-prompt";
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import packageJson from "./package.json" with { type: "json" };

const AUTOCOMPLETE_PAGE_SIZE = 10;

const dirName = dirname(fileURLToPath(import.meta.url));

function getMonorepoPackagePaths() {
    // TODO: glob使う
    return packageJson.workspaces
        .map((workspacePath) => workspacePath.replace(/\/\*$/, ""))
        .filter((workspaceDirectoryName) => workspaceDirectoryName !== "config")
        .filter((workspaceDirectoryName) =>
            existsSync(resolve(dirName, workspaceDirectoryName)),
        )
        .flatMap((workspaceDirectoryName) =>
            readdirSync(resolve(dirName, workspaceDirectoryName), {
                withFileTypes: true,
            }).filter((dirent) => dirent.isDirectory()),
        )
        .map(({ parentPath, name }) =>
            relative(dirName, resolve(parentPath, name)),
        );
}

function ignoreRelativePaths(
    relativePaths,
    targetDirFullPath,
    ignoreFileNames,
) {
    const ignore = Ignore();
    for (const ignoreFileName of ignoreFileNames) {
        const ignoreFileFullPath = resolve(targetDirFullPath, ignoreFileName);
        if (!existsSync(ignoreFileFullPath)) {
            continue;
        }

        ignore.add(readFileSync(ignoreFileFullPath).toString());
    }

    return ignore.filter(relativePaths);
}

function getChildDirectoryPaths(packagePath = "") {
    const IGNORE_FILE_NAMES = [".gitignore"];

    let childDirectoryRelativePaths = Array.from(
        new Set(
            readdirSync(dirName, {
                recursive: true,
                withFileTypes: true,
            })
                .filter((dirent) => dirent.isDirectory())
                .map(({ parentPath, name }) => resolve(parentPath, name))
                .map((fullPath) => relative(dirName, fullPath))
                .filter((relativePath) => !relativePath.startsWith(".")),
        ),
    );
    childDirectoryRelativePaths = ignoreRelativePaths(
        childDirectoryRelativePaths,
        resolve(dirName),
        IGNORE_FILE_NAMES,
    );

    const inPackageRelativePaths = childDirectoryRelativePaths
        .filter((relativePath) => relativePath.startsWith(packagePath))
        .map((relativePathFromDirName) =>
            relative(
                resolve(dirName, packagePath),
                relative(dirName, relativePathFromDirName),
            ),
        )
        .filter((relativePath) => !!relativePath);

    return ignoreRelativePaths(
        inPackageRelativePaths,
        resolve(dirName, packagePath),
        IGNORE_FILE_NAMES,
    );
}

export default function (
    /** @type {import('plop').NodePlopAPI} */
    plop,
) {
    plop.setGenerator("pseudo-enum", {
        description: "TypeScriptの疑似enumを作成。",
        prompts: async (inquirer) => {
            inquirer.registerPrompt("autocomplete", InquirerAutoCompletePrompt);

            const packageRelativePaths = getMonorepoPackagePaths();
            const { packageRelativePath } = await inquirer.prompt({
                type: "autocomplete",
                name: "packageRelativePath",
                message: "出力先packageを選択。",
                pageSize: AUTOCOMPLETE_PAGE_SIZE,
                source: async (_, input) =>
                    packageRelativePaths.filter((packageRelativePath) =>
                        !!input ? packageRelativePath.includes(input) : true,
                    ),
            });

            const childDirectoryPaths =
                getChildDirectoryPaths(packageRelativePath);
            const { outputRelativePath } = await inquirer.prompt({
                type: "autocomplete",
                name: "outputRelativePath",
                message: "出力先ディレクトリを選択。",
                pageSize: AUTOCOMPLETE_PAGE_SIZE,
                source: async (_, input) =>
                    input ?
                        childDirectoryPaths.filter((childDirectoryPath) =>
                            childDirectoryPath.includes(input),
                        )
                    :   childDirectoryPaths,
            });

            const { outputDirectoryName } = await inquirer.prompt({
                type: "input",
                name: "outputDirectoryName",
                message: "作成するディレクトリ名を入力(作らない場合は空)。",
            });
            const { pseudoEnumName } = await inquirer.prompt({
                type: "input",
                name: "pseudoEnumName",
                message: "作成する疑似enum名を入力。",
            });

            console.log({
                dirName,
                packageRelativePath,
                outputRelativePath,
                outputDirectoryName,
                outputDirectoryFullPath: resolve(
                    dirName,
                    packageRelativePath,
                    outputRelativePath,
                    outputDirectoryName,
                ),
                pseudoEnumName,
            });

            return {
                dirName,
                packageRelativePath,
                outputRelativePath,
                outputDirectoryName,
                outputDirectoryFullPath: resolve(
                    dirName,
                    packageRelativePath,
                    outputRelativePath,
                    outputDirectoryName,
                ),
                pseudoEnumName,
            };
        },
        actions: [
            {
                type: "add",
                path: "{{outputDirectoryFullPath}}/{{pascalCase pseudoEnumName}}.ts",
                templateFile: ".prop/template/pseudo-enum.ts.hbs",
            },
        ],
    });
}
