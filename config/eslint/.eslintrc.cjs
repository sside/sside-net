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
        "@typescript-eslint/member-ordering": "error",
    },
};
