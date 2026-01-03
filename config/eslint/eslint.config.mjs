import EslintJs from "@eslint/js";
import EslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import TsEslint from "typescript-eslint";

export default defineConfig([
    EslintJs.configs.recommended,
    TsEslint.configs.recommended,
    EslintConfigPrettier,
    {
        ignores: ["dist/", "tsconfig.json"],
    },
    {
        // ts, js共通のルール
        rules: {
            "@typescript-eslint/no-require-imports": "off",

            curly: "warn",
            "padding-line-between-statements": [
                "warn",
                {
                    blankLine: "always",
                    prev: "*",
                    next: "return",
                },
            ],
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        languageOptions: {
            parser: TsEslint.parser,
            parserOptions: {
                projectService: true,
            },
        },
        ignores: ["eslint.config.cjs"],
        rules: {
            "@typescript-eslint/no-empty-object-type": "off",

            "@typescript-eslint/member-ordering": "warn",

            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    caughtErrors: "none",
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            sourceType: "commonjs",
        },
    },
]);
