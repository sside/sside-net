const jestConfig = require("@sside-net/jest");

module.exports = {
    ...jestConfig,
    testMatch: [...jestConfig.testMatch, "**/*.spec.ts"],
};
