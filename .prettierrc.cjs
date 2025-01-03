module.exports = {
    singleAttributePerLine: true,
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    importOrder: [
        "^react",
        "^next",
        "^@nestjs/(.*)$",
        "^@prisma/(.*)$",
        "<THIRD_PARTY_MODULES>",
        "^@sside-net/(.*)$",
        "^[./]",
    ],
    importOrderParserPlugins: [
        "typescript",
        "jsx",
        "classProperties",
        "decorators-legacy",
    ],
};
