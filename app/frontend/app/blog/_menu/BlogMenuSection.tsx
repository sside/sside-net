import { FC } from "react";
import { VerticalDivider } from "../../../component/divider/VerticalDivider";
import { ChildrenProp } from "../../../type/ChildrenProp";
import { BlogMenuSectionHeader } from "./BlogMenuSectionHeader";

export const BlogMenuSection: FC<{ headerLabel: string } & ChildrenProp> = ({
    headerLabel,
    children,
}) => {
    return (
        <div className="grid w-full">
            <BlogMenuSectionHeader>{headerLabel}</BlogMenuSectionHeader>
            <VerticalDivider className="w-3/4" />
            {children}
        </div>
    );
};
