/** @type {import('eslint').ESLint.ConfigData} **/
module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "prettier",
    ],
    plugins: ["@typescript-eslint"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        projectService: true,
        // 使用するpackage側で以下を追加
        // tsconfigRootDir: __dirname
    },
    env: {
        node: true,
        browser: true,
    },
    ignorePatterns: [".eslintrc.cjs"],
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

        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                caughtErrors: "none",
                argsIgnorePattern: "^_",
            },
        ],
    },
};
