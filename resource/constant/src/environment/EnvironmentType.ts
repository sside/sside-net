export const EnvironmentType = {
    Development: "development",
    Production: "production",
    Test: "test",
} as const;
export type EnvironmentType =
    (typeof EnvironmentType)[keyof typeof EnvironmentType];
