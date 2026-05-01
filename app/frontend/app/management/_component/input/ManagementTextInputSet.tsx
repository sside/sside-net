import { ComponentProps, FC, useId } from "react";
import { twMerge } from "tailwind-merge";
import { ManagementInputSet } from "./ManagementInputSet";

export const ManagementTextInputSet: FC<
    {} & Omit<ComponentProps<"input">, "type" | "id"> &
        Pick<ComponentProps<typeof ManagementInputSet>, "label">
> = ({ label, className, ...inputProps }) => {
    const id = useId();

    return (
        <div className="management-text-input-set">
            <ManagementInputSet
                label={label}
                htmlFor={id}
            >
                <input
                    className={twMerge(
                        "border-base0 active:border-base2 w-lg rounded-md border p-2 active:border-2",
                        className,
                    )}
                    id={id}
                    type="text"
                    {...inputProps}
                />
            </ManagementInputSet>
        </div>
    );
};
