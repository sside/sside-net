import SharedConfig from "@sside-net/eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    SharedConfig,
    globalIgnores(["coverage/", "src/generated/"]),
    // {
    //     rules: {
    //         // NestJSのデフォルト設定。念のためコメントで残しておく。
    //         "@typescript-eslint/no-explicit-any": "off",
    //         "@typescript-eslint/no-floating-promises": "warn",
    //         "@typescript-eslint/no-unsafe-argument": "warn",
    //     },
    // },
]);
