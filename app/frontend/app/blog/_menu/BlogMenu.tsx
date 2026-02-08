import { FC } from "react";
import { BlogMenuAbout } from "./BlogMenuAbout";
import { BlogMenuArchives } from "./BlogMenuArchives";
import { BlogMenuMetaTags } from "./BlogMenuMetaTags";
import { BlogMenuOnlineAccounts } from "./BlogMenuOnlineAccounts";
import { BlogMenuRecentEntries } from "./BlogMenuRecentEntries";

export const BlogMenu: FC<{}> = ({}) => {
    return (
        <nav className="bg-background-menu text-base01 layout-area-menu blog-menu w-full">
            <BlogMenuAbout />
            <BlogMenuOnlineAccounts />
            <BlogMenuRecentEntries />
            <BlogMenuArchives />
            <BlogMenuMetaTags />
        </nav>
    );
};
