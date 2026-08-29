import { ComponentProps, FC } from "react";
import { twMerge } from "tailwind-merge";

export const VerticalDivider: FC<{
    className?: ComponentProps<"div">["className"];
}> = ({ className }) => {
    return (
        <div
            className={twMerge("vertical-divider w-full border-t", className)}
        />
    );
};
