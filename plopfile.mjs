import { pascalCase, camelCase } from "change-case";
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

function getChildDirectoryPaths(
    packagePath = "",
    ignoreFileNames = [".gitignore"],
) {
    console.log("packagePath", packagePath);
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
        ignoreFileNames,
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
        ignoreFileNames,
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
                getChildDirectoryPaths(packageRelativePath).toSorted();
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

            const outputDirectoryFullPath = resolve(
                dirName,
                packageRelativePath,
                outputRelativePath,
                outputDirectoryName,
            );

            console.log({
                dirName,
                packageRelativePath,
                outputRelativePath,
                outputDirectoryName,
                outputDirectoryFullPath,
                pseudoEnumName,
            });

            return {
                dirName,
                packageRelativePath,
                outputRelativePath,
                outputDirectoryName,
                outputDirectoryFullPath,
                camelPseudoEnumName: camelCase(pseudoEnumName),
                PascalPseudoEnumName: pascalCase(pseudoEnumName),
            };
        },
        actions: [
            {
                type: "add",
                path: "{{outputDirectoryFullPath}}/{{PascalPseudoEnumName}}.ts",
                templateFile: ".prop/template/pseudo-enum/pseudo-enum.ts.hbs",
            },
        ],
    });
    plop.setGenerator("function-component", {
        description: "フロントエンドのReact Function Componentを作成。",
        prompts: async (inquirer) => {
            inquirer.registerPrompt("autocomplete", InquirerAutoCompletePrompt);

            const functionComponentsDirectoryRelativePath = relative(
                resolve(dirName),
                resolve(dirName, "app/frontend"),
            );
            const childDirectoryPaths = getChildDirectoryPaths(
                functionComponentsDirectoryRelativePath,
            ).filter((relativePath) =>
                ["app", "component"].some((targetPath) =>
                    relativePath.startsWith(targetPath),
                ),
            );
            const { outputRelativePath } = await inquirer.prompt({
                type: "autocomplete",
                name: "outputRelativePath",
                message: "出力先ディレクトリを選択。",
                pageSize: AUTOCOMPLETE_PAGE_SIZE,
                source: (_, input) =>
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

            const { functionComponentName } = await inquirer.prompt({
                type: "input",
                name: "functionComponentName",
                message: "作成する疑似enum名を入力。",
            });

            const { isClientComponent } = await inquirer.prompt({
                type: "confirm",
                name: "isClientComponent",
                message: "Client Componentですか？",
                default: false,
            });

            const outputDirectoryFullPath = resolve(
                dirName,
                functionComponentsDirectoryRelativePath,
                outputRelativePath,
                outputDirectoryName,
            );

            console.log({
                outputDirectoryFullPath,
                functionComponentName,
                isClientComponent,
            });

            return {
                outputDirectoryFullPath,
                camelFunctionComponentName: camelCase(functionComponentName),
                PascalFunctionComponentName: pascalCase(functionComponentName),
                isClientComponent,
            };
        },
        actions: () => [
            {
                type: "add",
                path: "{{outputDirectoryFullPath}}/{{PascalFunctionComponentName}}.tsx",
                templateFile:
                    ".prop/template/function-component/function-component.tsx.hbs",
            },
            {
                type: "add",
                path: "{{outputDirectoryFullPath}}/{{PascalFunctionComponentName}}.stories.tsx",
                templateFile:
                    ".prop/template/function-component/function-component.stories.tsx.hbs",
            },
        ],
    });
}
