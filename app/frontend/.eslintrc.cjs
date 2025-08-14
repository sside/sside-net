const eslintrc = require("@sside-net/eslint");

module.exports = {
    ...eslintrc,
    extends: [
        ...eslintrc.extends,
        "next/core-web-vitals",
        "next/typescript",
        "prettier",
    ],
    rules: {
        ...eslintrc.rules,

        "@next/next/no-img-element": "off",
        "@typescript-eslint/no-empty-object-type": "off",
    },
    parserOptions: {
        ...eslintrc.parserOptions,
        tsconfigRootDir: __dirname,
    },
};
