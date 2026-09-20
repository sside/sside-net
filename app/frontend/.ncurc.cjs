const config = require("../../.ncurc.cjs");

module.exports = {
    ...config,
    reject: [
        ...config.reject,
        // 4.37.1でエラーになるようになったので、解決するまでバージョン固定
        "@yaireo/tagify",
    ],
};
