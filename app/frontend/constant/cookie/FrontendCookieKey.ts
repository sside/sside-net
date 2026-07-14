export const FrontendCookieKey = {
    AccessToken: "access_token",
    RefreshToken: "refresh_token",
} as const;
export type FrontendCookieKey =
    (typeof FrontendCookieKey)[keyof typeof FrontendCookieKey];
