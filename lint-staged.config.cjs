// const { dirname, resolve } = require("path");
// const { existsSync } = require("fs");

module.exports = {
    // "*.{ts,tsx,js,jsx}": (stagedFilePaths) =>
    //     stagedFilePaths
    //         .filter(
    //             (stagedFilePath) =>
    //                 !existsSync(
    //                     resolve(dirname(stagedFilePath), "package.json"),
    //                 ),
    //         )
    //         .map((stagedFilePath) => `eslint --fix '${stagedFilePath}'`),
    "*.{ts,tsx,js,jsx,mjs,cjs,json,yml,yaml,md}": ["prettier --write"],
    "schema.prisma": ["npx prisma format --schema"],
};
