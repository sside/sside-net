const config = require("../../.ncurc.cjs");

module.exports = {
    ...config,
    reject: [
        ...config.reject,
        // openapi-typescriptが5.xまでのサポートに留まっているためバージョン固定
        "typescript",
    ],
};
