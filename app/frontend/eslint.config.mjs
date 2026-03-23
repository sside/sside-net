import EslintPluginNext from "@next/eslint-plugin-next";
import SharedConfig from "@sside-net/eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    SharedConfig,
    globalIgnores([
        "playwright-report/",
        "test-results/",
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "public/**",
    ]),
    {
        plugins: {
            "@next/next": EslintPluginNext,
        },
        rules: {
            ...EslintPluginNext.configs["core-web-vitals"].rules,
            ...EslintPluginNext.configs.recommended.rules,

            "no-empty-pattern": "off",
            "@next/next/no-img-element": "off",
            "@typescript-eslint/no-empty-object-type": "off",
        },
    },
]);
