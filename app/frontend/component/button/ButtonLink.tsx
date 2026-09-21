import { Route } from "next";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { ChildrenProp } from "../../type/ChildrenProp";
import { buttonStyle, ButtonVariant } from "./Button";

export const ButtonLink = <T extends string>({
    href,
    variant,
    className,
    children,
}: {
    href: Route<T>;
    variant?: ButtonVariant;
    className?: string;
} & ChildrenProp) => {
    return (
        <Link
            className={buttonStyle({
                className: twMerge("button-link", className),
                variant,
            })}
            href={href}
        >
            {children}
        </Link>
    );
};
