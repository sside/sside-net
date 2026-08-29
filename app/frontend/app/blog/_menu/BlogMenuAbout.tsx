import { FC } from "react";
import { BlogMenuSection } from "./BlogMenuSection";

export const BlogMenuAbout: FC<{}> = ({}) => {
    return (
        <div className="blog-menu-about">
            <BlogMenuSection headerLabel="About this site">
                <p>長い文章載せたい時があるので作りました。</p>
                <p>
                    コメント欄は用意しないので、誤りの指摘やご意見があれば
                    <a href="https://x.com/sside">Twitter</a> までどうぞ。
                </p>
            </BlogMenuSection>
        </div>
    );
};
