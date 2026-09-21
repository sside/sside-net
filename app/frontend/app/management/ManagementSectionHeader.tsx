import { FC } from "react";
import { OptionalChildrenProp } from "../../type/ChildrenProp";

export const ManagementSectionHeader: FC<
    { text: string } & OptionalChildrenProp
> = ({ children, text }) => {
    return (
        <header className="management-section-header flex items-end gap-8">
            <span className="text-6xl font-thin">{text}</span>
            {children}
        </header>
    );
};
