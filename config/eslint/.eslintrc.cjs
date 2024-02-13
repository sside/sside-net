module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint"],
    env: {
        node: true,
        browser: true,
    },
    rules: {
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/return-await": "error",
    },
};
