const { readdirSync, rmSync, existsSync } = require("fs");
const { resolve } = require("path");

function resolveDirectoryPath(file) {
    return resolve(file.parentPath, file.name);
}

function deleteNodeModulesRecursive(targetPath) {
    console.log("search node_modules", targetPath);

    const files = readdirSync(targetPath, {
        withFileTypes: true,
    });
    if (!files.some((file) => file.isDirectory())) {
        return;
    }

    for (const file of files) {
        if (file.isDirectory() && file.name === "node_modules") {
            const deletePath = resolveDirectoryPath(file);
            console.log("delete node_modules", deletePath);

            rmSync(deletePath, {
                force: true,
                recursive: true,
            });

            break;
        }
    }

    for (const file of readdirSync(targetPath, {
        withFileTypes: true,
    })) {
        if (file.isDirectory()) {
            deleteNodeModulesRecursive(resolve(file.parentPath, file.name));
        }
    }
}

deleteNodeModulesRecursive(__dirname);

const lockFilePath = resolve(__dirname, "package-lock.json");
if (existsSync(lockFilePath)) {
    console.log("delete package-lock", lockFilePath);
    rmSync(lockFilePath);
}
