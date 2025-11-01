import SharedConfig from "@sside-net/eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    SharedConfig,
    {
        ignores: ["./*.(|m|c)js(|x)", "./*.(|m|c)ts(|x)", "./generated"],
    },
]);
