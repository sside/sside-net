"use client";

import { FC, useId, useState } from "react";
import { redirect } from "next/navigation";
import { getAppConfig } from "@sside-net/app-config";
import { validateRequired } from "@sside-net/validator";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../component/button/Button";
import { paths } from "../../generated/api-client/backend-schema";
import { ManagementInputSet } from "../management/_component/input/ManagementInputSet";

type SignInFormInput = {
    password: string;
};

export const SignInForm: FC<{}> = ({}) => {
    const [signInErrorMessage, setSignInErrorMessage] = useState<string | null>(
        null,
    );
    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm<SignInFormInput>({
        defaultValues: {
            password: "",
        },
    });
    const passwordElementId = useId();

    const onSubmit: SubmitHandler<SignInFormInput> = async ({ password }) => {
        setSignInErrorMessage(null);

        const response = await fetch("/api/authentication/sign-in", {
            method: "POST",
            body: JSON.stringify({
                password,
            } satisfies paths["/authentication/sign-in"]["post"]["requestBody"]["content"]["application/json"]),
        });

        if (!response.clone().ok) {
            return setSignInErrorMessage(await response.text());
        }

        return redirect("/management");
    };

    return (
        <form
            className="sign-in-form bg-base2 text-base02 grid w-fit gap-8 rounded-2xl p-8"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h1 className="text-center text-2xl">
                {getAppConfig().global.appName} sign in
            </h1>
            <ManagementInputSet
                label="password"
                htmlFor={passwordElementId}
            >
                <input
                    {...register("password", {
                        validate: validateRequired,
                    })}
                    className="rounded-md border p-2"
                    id={passwordElementId}
                    type="password"
                />
            </ManagementInputSet>
            {signInErrorMessage && <span>{signInErrorMessage}</span>}
            <Button
                variant="primary"
                type="submit"
                disabled={!isValid}
            >
                sign in
            </Button>
        </form>
    );
};
