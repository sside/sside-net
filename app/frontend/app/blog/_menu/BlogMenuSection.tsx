import { FC } from "react";
import { VerticalDivider } from "../../../component/divider/VerticalDivider";
import { ChildrenProp } from "../../../type/ChildrenProp";

export const BlogMenuSection: FC<{ headerLabel: string } & ChildrenProp> = ({
    headerLabel,
    children,
}) => {
    return (
        <div className="blog-menu-section grid w-full">
            <header className="px-menu w-full text-xl font-light">
                {headerLabel}
            </header>
            <VerticalDivider />
            <div className="px-menu py-1 font-light">{children}</div>
        </div>
    );
};
