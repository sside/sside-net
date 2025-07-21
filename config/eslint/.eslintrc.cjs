/** @type {import('eslint').ESLint.ConfigData} **/
module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    env: {
        node: true,
        browser: true,
    },
    rules: {
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-empty-object-type": "off",

        curly: "warn",
        "@typescript-eslint/member-ordering": "warn",
        "padding-line-between-statements": [
            "warn",
            {
                blankLine: "always",
                prev: "*",
                next: "return",
            },
        ],

        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                caughtErrors: "none",
                argsIgnorePattern: "^_",
            },
        ],
    },
};
