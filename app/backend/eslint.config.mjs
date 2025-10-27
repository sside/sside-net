import SharedConfig from "@sside-net/eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    SharedConfig,
    // {
    //     rules: {
    //         // NestJSのデフォルト設定。念のためコメントで残しておく。
    //         "@typescript-eslint/no-explicit-any": "off",
    //         "@typescript-eslint/no-floating-promises": "warn",
    //         "@typescript-eslint/no-unsafe-argument": "warn",
    //     },
    // },
]);
