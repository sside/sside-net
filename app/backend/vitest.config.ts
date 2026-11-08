import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["./src/**/*.spec.ts"],
        globalSetup: "./src/library/test/database/createBaseTestDatabase.ts",
    },
});
