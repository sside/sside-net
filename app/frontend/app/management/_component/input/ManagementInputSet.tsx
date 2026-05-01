import { FC } from "react";
import { ChildrenProp } from "../../../../type/ChildrenProp";

export const ManagementInputSet: FC<
    { label: string; htmlFor?: string } & ChildrenProp
> = ({ label, htmlFor, children }) => {
    return (
        <div className="management-input-set grid gap-1">
            <label
                className="block w-40 pr-4 text-sm"
                htmlFor={htmlFor}
            >
                {label}
            </label>
            {children}
        </div>
    );
};
