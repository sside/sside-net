module.exports = {
    plugins: [
        "@trivago/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss",
    ],
    tailwindFunctions: ["tv"],
    singleAttributePerLine: true,
    experimentalTernaries: true,
    importOrder: [
        "^@storybook/",
        "^react$",
        "^next$",
        "^next/(.+)$",
        "<THIRD_PARTY_MODULES>",
        "^[./]",
    ],
    importOrderSeparation: false,
    importOrderParserPlugins: [
        "typescript",
        "jsx",
        "classProperties",
        "decorators-legacy",
    ],
};
