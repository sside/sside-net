import { resolve } from "node:path";

/**
 * テスト用DBのファイル置き場を取得します。
 * _dirnameからの相対パスにするため、この関数だけ別ファイルにしています。
 */
export const getDatabaseFileDirectoryPath = () =>
    resolve(__dirname, "../../../..", ".database");
