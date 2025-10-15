module.exports = {
    cooldown: 14,
    reject: [
        // flat configの諸々が落ち着くまで上げない
        "eslint",
        // プロジェクトのnodeのメジャーバージョンに合わせる
        "@types/node",
        // faker@10がESM onlyのため一旦バージョンを固定
        "@faker-js/faker",
    ],
};
