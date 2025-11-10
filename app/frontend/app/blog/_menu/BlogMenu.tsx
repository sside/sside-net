import { FC } from "react";
import { BlogMenuAbout } from "./BlogMenuAbout";
import { BlogMenuOnlineAccounts } from "./BlogMenuOnlineAccounts";

export const BlogMenu: FC<{}> = ({}) => {
    return (
        <div className="bg-background-menu text-base01 layout-area-menu w-full">
            <BlogMenuAbout />
            <BlogMenuOnlineAccounts />
        </div>
    );
};
