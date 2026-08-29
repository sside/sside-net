import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { VerticalDivider } from "../../../component/divider/VerticalDivider";
import { ChildrenProp } from "../../../type/ChildrenProp";

export const BlogMenuSection: FC<{ headerLabel: string } & ChildrenProp> = ({
    headerLabel,
    children,
}) => {
    const horizontalPadding = "px-2";

    return (
        <div className="grid w-full">
            <header
                className={twMerge(
                    "w-full text-xl font-light",
                    horizontalPadding,
                )}
            >
                {headerLabel}
            </header>
            <VerticalDivider />
            <div className={twMerge("py-1 font-light", horizontalPadding)}>
                {children}
            </div>
        </div>
    );
};
