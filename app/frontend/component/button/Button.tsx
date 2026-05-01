import { ComponentProps, FC } from "react";
import { tv } from "tailwind-variants";

const ButtonVariant = {
    Primary: "primary",
    PrimaryBordered: "primaryBordered",
} as const;
type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const Button: FC<
    { variant?: ButtonVariant } & ComponentProps<"button">
> = ({ variant, ...buttonElementProps }) => {
    const style = tv({
        base: "text-base2 cursor-pointer rounded-lg border-2 bg-transparent px-4 py-2 disabled:cursor-not-allowed",
        variants: {
            variant: {
                [ButtonVariant.Primary]:
                    "bg-blue border-blue disabled:bg-base00",
                [ButtonVariant.PrimaryBordered]: "border-blue",
            },
        },
    });

    return (
        <button
            className={style({ variant })}
            {...buttonElementProps}
        />
    );
};
