import { ComponentProps, FC, useId } from "react";
import { twMerge } from "tailwind-merge";
import { ManagementInputSet } from "./ManagementInputSet";

export const ManagementDateTimeInputSet: FC<
    Pick<ComponentProps<typeof ManagementInputSet>, "label"> &
        Omit<ComponentProps<"input">, "id" | "type">
> = ({ label, className, ...inputProps }) => {
    const id = useId();

    return (
        <div className="management-date-time-input-set">
            <ManagementInputSet
                label={label}
                htmlFor={id}
            >
                <input
                    className={twMerge(
                        "border-base0 active:border-base2 w-fit rounded-md border p-2 active:border-2",
                        className,
                    )}
                    id={id}
                    type="datetime-local"
                    {...inputProps}
                />
            </ManagementInputSet>
        </div>
    );
};
