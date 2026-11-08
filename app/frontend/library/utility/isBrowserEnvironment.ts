/**
 * この関数が実行される環境がWebブラウザか判定します。
 */
export const isBrowserEnvironment = () => typeof window !== "undefined";

/**
 * この関数が実行される環境がNodeのサーバ上か判定します。
 */
export const isServerEnvironment = () => !isBrowserEnvironment();
