export const EnvironmentType = {
    Production: "production",
    Local: "local",
    Test: "test",
} as const;
export type EnvironmentType =
    (typeof EnvironmentType)[keyof typeof EnvironmentType];
