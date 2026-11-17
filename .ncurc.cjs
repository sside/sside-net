module.exports = {
    cooldown: 14,
    reject: [
        // プロジェクトのnodeのメジャーバージョンに合わせる
        "@types/node",
        // TypeScript 7.1まで見送り
        "typescript",
    ],
};
