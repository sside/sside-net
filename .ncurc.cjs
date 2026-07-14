module.exports = {
    reject: [
        // プロジェクトのnodeのメジャーバージョンに合わせる
        "@types/node",
        // faker@10がESM onlyのため一旦バージョンを固定
        "@faker-js/faker",
    ],
};
