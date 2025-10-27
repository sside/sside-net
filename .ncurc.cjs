module.exports = {
    cooldown: 14,
    reject: [
        // プロジェクトのnodeのメジャーバージョンに合わせる
        "@types/node",
        // faker@10がESM onlyのため一旦バージョンを固定
        "@faker-js/faker",
    ],
};
