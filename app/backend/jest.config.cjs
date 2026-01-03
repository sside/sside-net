const jestConfig = require("@sside-net/jest");

module.exports = {
    ...jestConfig,
    testMatch: [...jestConfig.testMatch, "**/*.spec.ts"],
    globalSetup:
        "<rootDir>/src/library/test/database/createBaseTestDatabase.ts",
};
