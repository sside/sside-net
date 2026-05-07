export const CookieKey = {
    AuthenticationJwt: "authentication-jwt",
} as const;
export type CookieKey = (typeof CookieKey)[keyof typeof CookieKey];
