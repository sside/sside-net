import { resolve } from "node:path";

/**
 * テスト用DBのファイル置き場を取得
 */
export const getDatabaseFileDirectoryPath = () =>
    resolve(__dirname, "../../../..", ".database"); //_dirnameからの相対パスにするため、この関数だけ別ファイルにしている。
