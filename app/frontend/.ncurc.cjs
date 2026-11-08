const config = require("../../.ncurc.cjs");

module.exports = {
    ...config,
    reject: [
        ...config.reject,
        // 4.37.1でエラーになるようになったので、解決するまでバージョン固定
        "@yaireo/tagify",
        // msw 3はnext/dist/experimental/testmode/playwright/mswからの利用時にAPI非互換性があるので一旦バージョン固定
        "msw",
        "@msw/playwright",
    ],
};
