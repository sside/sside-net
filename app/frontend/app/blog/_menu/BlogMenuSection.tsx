import { FC } from "react";
import { ChildrenProp } from "../../../type/ChildrenProp";
import { BlogMenuSectionHeader } from "./BlogMenuSectionHeader";

export const BlogMenuSection: FC<{ headerLabel: string } & ChildrenProp> = ({
    headerLabel,
    children,
}) => {
    return (
        <div className="w-full">
            <BlogMenuSectionHeader>{headerLabel}</BlogMenuSectionHeader>
            {children}
        </div>
    );
};
