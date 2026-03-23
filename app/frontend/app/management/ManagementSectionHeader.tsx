import { FC } from "react";

export const ManagementSectionHeader: FC<{ text: string }> = ({ text }) => {
    return (
        <header className="management-section-header text-6xl font-thin">
            {text}
        </header>
    );
};
