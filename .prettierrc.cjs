module.exports = {
    singleAttributePerLine: true,
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    importOrder: [
        "^react",
        "^next",
        "<THIRD_PARTY_MODULES>",
        "^@sside-net/(.*)$",
        "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
};
