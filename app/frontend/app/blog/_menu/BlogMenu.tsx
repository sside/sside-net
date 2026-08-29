import { FC } from "react";
import { BlogMenuAbout } from "./BlogMenuAbout";
import { BlogMenuArchives } from "./BlogMenuArchives";
import { BlogMenuMetaTags } from "./BlogMenuMetaTags";
import { BlogMenuOnlineAccounts } from "./BlogMenuOnlineAccounts";
import { BlogMenuRecentEntries } from "./BlogMenuRecentEntries";

export const BlogMenu: FC<{}> = ({}) => {
    return (
        <aside className="blog-title text-text-menu layout-area-menu blog-menu bg-background-menu w-full px-4 text-sm">
            <BlogMenuAbout />
            <BlogMenuOnlineAccounts />
            <BlogMenuRecentEntries />
            <BlogMenuArchives />
            <BlogMenuMetaTags />
        </aside>
    );
};
