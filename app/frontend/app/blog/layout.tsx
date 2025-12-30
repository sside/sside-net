import { ChildrenProp } from "../../type/ChildrenProp";
import { BlogTitle } from "./BlogTitle";
import { BlogFooter } from "./_footer/BlogFooter";
import { BlogMenu } from "./_menu/BlogMenu";

export default async function BlogLayout({ children }: ChildrenProp) {
    return (
        <div className="layout-mobile sm:layout-desktop grid min-h-dvh grid-cols-[20rem_1fr] grid-rows-[auto_1fr_auto]">
            <BlogTitle />
            <div className="layout-area-main">{children}</div>
            <BlogMenu />
            <BlogFooter />
        </div>
    );
}
