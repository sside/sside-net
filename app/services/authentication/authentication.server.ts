import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { Environment } from "../../libraries/environment/Environment";
import { sessionStorage } from "./authenticationSession.server";
import { AuthenticationInputName } from "./constants/AuthenticationInputName";

export let authenticator = new Authenticator(sessionStorage);
export const ADMINISTRATOR_AUTHENTICATION_STRATEGY_NAME = "administrator-authentication";

authenticator.use(
    new FormStrategy(async ({ form }) => {
        const { ADMINISTRATOR_EMAIL_ADDRESS, ADMINISTRATOR_PASSWORD } = Environment.instance.variable;

        const { UserId, Password } = AuthenticationInputName;
        const userId = form.get(UserId);
        const password = form.get(Password);

        if (!userId || !password) {
            throw new AuthorizationError(`ユーザID、またはパスワードが未定義です。`);
        }
        if (userId !== ADMINISTRATOR_EMAIL_ADDRESS || password !== ADMINISTRATOR_PASSWORD) {
            throw new AuthorizationError(`認証失敗。`);
        }

        return userId;
    }),
    ADMINISTRATOR_AUTHENTICATION_STRATEGY_NAME,
);
