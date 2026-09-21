import { ComponentProps, FC } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const ButtonVariant = {
    Primary: "primary",
    PrimaryBordered: "primaryBordered",
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const buttonStyle = tv({
    base: "text-base2 cursor-pointer rounded-lg border-2 bg-transparent px-4 py-2 text-nowrap disabled:cursor-not-allowed",
    variants: {
        variant: {
            [ButtonVariant.Primary]: "bg-blue border-blue disabled:bg-base00",
            [ButtonVariant.PrimaryBordered]: "border-blue",
        },
    },
});

export const Button: FC<
    { variant?: ButtonVariant } & ComponentProps<"button">
> = ({ variant, className, ...buttonElementProps }) => {
    return (
        <button
            className={buttonStyle({
                variant,
                className: twMerge("button", className),
            })}
            {...buttonElementProps}
        />
    );
};
