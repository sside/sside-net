module.exports = {
    cooldown: 7,
    reject: [
        // プロジェクトのnodeのメジャーバージョンに合わせる
        "@types/node",
        // TypeScript 7.1まで見送り
        "typescript",
    ],
};
