export const LogLevel = {
    Debug: "debug",
    Info: "info",
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
