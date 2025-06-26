import { resolve } from "node:path";

export const getDatabaseFileDirectoryPath = () =>
    resolve(__dirname, "../../../..", ".database");
