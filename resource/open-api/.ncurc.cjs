module.exports = {
    cooldown: 14,
    reject: [
        // openapi-typescriptが5.xまでのサポートに留まっているためバージョン固定
        "typescript",
    ],
};
