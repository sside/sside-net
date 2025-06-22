module.exports = {
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    singleAttributePerLine: true,
    importOrder: [
        "^@storybook/",
        "^react$",
        "^next$",
        "^next/(.+)$",
        "<THIRD_PARTY_MODULES>",
        "^[./]",
    ],
    importOrderSeparation: false,
    experimentalTernaries: true,
    importOrderParserPlugins: [
        "typescript",
        "classProperties",
        "decorators-legacy",
    ],
};
