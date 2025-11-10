import { ChildrenProp } from "../../type/ChildrenProp";
import { BlogTitle } from "./BlogTitle";
import { BlogFooter } from "./_footer/BlogFooter";
import { BlogMenu } from "./_menu/BlogMenu";

export default async function BlogLayout({ children }: ChildrenProp) {
    return (
        <div className="layout-mobile sm:layout-desktop grid grid-cols-[20rem_1fr]">
            <BlogTitle />
            <div className="layout-area-main">{children}</div>
            <BlogMenu />
            <BlogFooter />
        </div>
    );
}
