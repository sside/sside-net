import { FC } from "react";
import { ChildrenProp } from "../../../type/ChildrenProp";

export const BlogMenuSectionHeader: FC<{} & ChildrenProp> = ({ children }) => {
    return <header className="w-full text-xl">{children}</header>;
};
