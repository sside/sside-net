const eslintrc = require("@sside-net/eslint");

module.exports = {
    ...eslintrc,
    rules: {
        ...eslintrc.rules,
        // NestJSのデフォルト設定。念のためコメントで残しておく。
        // "@typescript-eslint/no-explicit-any": "off",
        // "@typescript-eslint/no-floating-promises": "warn",
        // "@typescript-eslint/no-unsafe-argument": "warn",
    },
    parserOptions: {
        ...eslintrc.parserOptions,
        tsconfigRootDir: __dirname,
    },
};
