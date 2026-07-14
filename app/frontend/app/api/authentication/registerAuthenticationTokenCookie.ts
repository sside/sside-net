import { cookies } from "next/headers";
import { DateTime } from "luxon";
import { FrontendCookieKey } from "../../../constant/cookie/FrontendCookieKey";

export const registerAuthenticationTokenCookie = async (
    accessToken: string,
    refreshToken: string,
): Promise<void> => {
    // トークンの有効期間判定はバックエンドで行うので、Cookieの保持期間は設定可能な最大値にしている。
    const cookieExpireAt = DateTime.now()
        .plus({
            day: 400,
        })
        .toJSDate();

    const { AccessToken: AccessTokenKey, RefreshToken: RefreshTokenKey } =
        FrontendCookieKey;
    const cookieState = await cookies();
    cookieState.set({
        name: AccessTokenKey,
        value: accessToken,
        expires: cookieExpireAt,
    });
    cookieState.set({
        name: RefreshTokenKey,
        value: refreshToken,
        expires: cookieExpireAt,
    });
};
