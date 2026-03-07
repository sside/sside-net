import EslintJs from "@eslint/js";
import { camelCase, pascalCase } from "change-case";
import EslintConfigPrettier from "eslint-config-prettier/flat";
import EslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig, globalIgnores } from "eslint/config";
import TsEslint from "typescript-eslint";

export default defineConfig([
    EslintJs.configs.recommended,
    TsEslint.configs.recommended,
    EslintPluginUnicorn.configs.recommended,
    EslintConfigPrettier,
    globalIgnores(["dist/", ".turbo/", "node_modules/", "tsconfig.json"]),
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
            "unicorn/prefer-top-level-await": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-await-expression-member": "off",
            "unicorn/no-null": "off",
            "unicorn/no-array-callback-reference": "off",
            "unicorn/consistent-function-scoping": "off",
            "unicorn/no-array-reduce": "off",
            "unicorn/prefer-set-has": "off",
            "unicorn/switch-case-braces": "off",
            "unicorn/no-useless-undefined": "off",
            "unicorn/catch-error-name": "off",
            "unicorn/no-typeof-undefined": "off",
            "unicorn/explicit-length-check": "off",

            "@typescript-eslint/member-ordering": "warn",
            "unicorn/prevent-abbreviations": [
                "warn",
                {
                    allowList: ["e", "prop", "props", "i", "args"].reduce(
                        (prev, curr) => ({
                            ...prev,
                            [camelCase(curr)]: true,
                            [pascalCase(curr)]: true,
                        }),
                        {},
                    ),
                },
            ],

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
            "unicorn/import-style": [
                "error",
                {
                    styles: {
                        path: false,
                        "node:path": false,
                    },
                },
            ],
        },
    },
    {
        files: [
            "**/*.test.ts",
            "**/*.test.tsx",
            "**/*.spec.ts",
            "**/*.spec.tsx",
        ],
        rules: {},
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            sourceType: "commonjs",
        },
    },
]);
