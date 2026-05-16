const { readdirSync, rmSync, existsSync } = require("node:fs");
const { resolve } = require("node:path");

function deleteNodeModulesRecursive(targetDirectoryPath) {
    console.log("search node_modules", targetDirectoryPath);

    const dirEnts = readdirSync(targetDirectoryPath, {
        withFileTypes: true,
    });
    if (!dirEnts.some((dirEnt) => dirEnt.isDirectory())) {
        return;
    }

    for (const file of dirEnts) {
        if (file.isDirectory() && file.name === "node_modules") {
            const deletePath = resolve(file.parentPath, file.name);
            console.log("delete node_modules", deletePath);

            rmSync(deletePath, {
                force: true,
                recursive: true,
            });

            break;
        }
    }

    for (const file of readdirSync(targetDirectoryPath, {
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
